import BN from 'bn.js';
import {
  DidUri,
  KiltKeyringPair,
  SignExtrinsicCallback,
  SubmittableExtrinsic,
} from '@kiltprotocol/types';
import { Blockchain } from '@kiltprotocol/chain-helpers';
import * as Did from '@kiltprotocol/did';
import { ConfigService } from '@kiltprotocol/config';

import { getIdentityCryptoFromSeed, Identity } from '../identities/identities';
import { isFullDid } from '../did/did';
import { makeFakeIdentityCrypto } from '../makeFakeIdentityCrypto/makeFakeIdentityCrypto';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
}

async function getSignedTransaction(
  keypair: KiltKeyringPair,
  sign: SignExtrinsicCallback,
  fullDid: DidUri,
): Promise<DidTransaction> {
  const api = ConfigService.get('api');
  const { address } = keypair;

  const chainDid = Did.toChain(fullDid);
  const { web3Name, document } = Did.linkedInfoFromChain(
    await api.call.did.query(chainDid),
  );

  const didRemoveExtrinsic = api.tx.did.delete(document.service?.length ?? 0);

  let authorized: SubmittableExtrinsic;

  if (web3Name) {
    const w3nRemoveExtrinsic = api.tx.web3Names.releaseByOwner();

    const txCounter = (await api.query.did.did(chainDid))
      .unwrap()
      .lastTxCounter.toBn();

    const w3nRemoveAuthorized = await Did.authorizeTx(
      document.uri,
      w3nRemoveExtrinsic,
      sign,
      address,
      { txCounter },
    );
    txCounter.iaddn(1);
    const didRemoveAuthorized = await Did.authorizeTx(
      document.uri,
      didRemoveExtrinsic,
      sign,
      address,
      { txCounter },
    );

    authorized = api.tx.utility.batchAll([
      w3nRemoveAuthorized,
      didRemoveAuthorized,
    ]);
  } else {
    authorized = await Did.authorizeTx(
      document.uri,
      didRemoveExtrinsic,
      sign,
      address,
    );
  }

  const extrinsic = await authorized.signAsync(keypair);

  return { extrinsic };
}

export async function getFee(did: DidUri | undefined): Promise<BN> {
  if (!did || !isFullDid(did)) {
    return new BN(0);
  }
  const { keypair, sign } = makeFakeIdentityCrypto();
  const { extrinsic } = await getSignedTransaction(keypair, sign, did);

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
  const { keypair, sign } = await getIdentityCryptoFromSeed(seed);
  const { extrinsic } = await getSignedTransaction(keypair, sign, identity.did);

  const hash = extrinsic.hash.toHex();
  currentTx[hash] = { extrinsic };
  return hash;
}

export async function submit(hash: string): Promise<void> {
  const { extrinsic } = currentTx[hash];
  await Blockchain.submitSignedTx(extrinsic, {
    resolveOn: Blockchain.IS_FINALIZED,
  });
  delete currentTx[hash];
}
