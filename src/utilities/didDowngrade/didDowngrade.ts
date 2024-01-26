import type {
  Did,
  KiltKeyringPair,
  SignerInterface,
  SubmittableExtrinsic,
} from '@kiltprotocol/types';

import BN from 'bn.js';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { Blockchain } from '@kiltprotocol/chain-helpers';
import {
  authorizeBatch,
  authorizeTx,
  linkedInfoFromChain,
  toChain,
} from '@kiltprotocol/did';

import { getIdentityCryptoFromSeed, Identity } from '../identities/identities';
import { isFullDid } from '../did/did';
import { makeFakeIdentityCrypto } from '../makeFakeIdentityCrypto/makeFakeIdentityCrypto';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
}

async function getSignedTransaction(
  keypair: KiltKeyringPair,
  signers: SignerInterface[],
  did: Did,
): Promise<DidTransaction> {
  const api = ConfigService.get('api');
  const submitter = keypair.address;

  const chainDid = toChain(did);
  const { document } = linkedInfoFromChain(await api.call.did.query(chainDid));
  const web3Name = document.alsoKnownAs?.[0];
  const servicesCount = document.service?.length ?? 0;

  let authorized: SubmittableExtrinsic;

  if (web3Name) {
    authorized = await authorizeBatch({
      batchFunction: api.tx.utility.batchAll,
      did,
      extrinsics: [
        api.tx.web3Names.releaseByOwner(),
        api.tx.did.delete(servicesCount),
      ],
      signers,
      submitter,
    });
  } else {
    authorized = await authorizeTx(
      document.id,
      api.tx.did.delete(servicesCount),
      signers,
      submitter,
    );
  }

  const extrinsic = await authorized.signAsync(keypair);

  return { extrinsic };
}

export async function getFee(did: Did | undefined): Promise<BN> {
  if (!did || !isFullDid(did)) {
    return new BN(0);
  }
  const { keypair, signers } = await makeFakeIdentityCrypto();
  const { extrinsic } = await getSignedTransaction(keypair, signers, did);

  return (await extrinsic.paymentInfo(keypair)).partialFee;
}

const currentTx: Record<string, DidTransaction> = {};

export async function sign(
  identity: Identity,
  seed: Uint8Array,
): Promise<string> {
  if (!identity.did) {
    throw new Error('DID is deleted and unusable');
  }
  const { keypair, signers } = await getIdentityCryptoFromSeed(seed);
  const { extrinsic } = await getSignedTransaction(
    keypair,
    signers,
    identity.did,
  );

  const hash = extrinsic.hash.toHex();
  currentTx[hash] = { extrinsic };
  return hash;
}

export async function submit(hash: string): Promise<void> {
  const { extrinsic } = currentTx[hash];
  await Blockchain.submitSignedTx(extrinsic);
  delete currentTx[hash];
}
