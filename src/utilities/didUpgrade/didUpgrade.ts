import type {
  Did,
  DidDocument,
  KiltAddress,
  KiltKeyringPair,
  SignerInterface,
  SubmittableExtrinsic,
} from '@kiltprotocol/types';

import BN from 'bn.js';

import { useMemo } from 'react';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { Blockchain } from '@kiltprotocol/chain-helpers';
import {
  NewDidEncryptionKey,
  NewDidVerificationKey,
  createLightDidDocument,
  getStoreTx,
} from '@kiltprotocol/did';

import { getIdentityCryptoFromSeed } from '../identities/identities';
import { parseDidUri } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { useAddressBalance } from '../../components/Balance/Balance';
import { getDepositDid } from '../getDeposit/getDeposit';
import { makeFakeIdentityCrypto } from '../makeFakeIdentityCrypto/makeFakeIdentityCrypto';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: Did;
}

export async function getTransaction(
  lightDidDocument: DidDocument,
  keysToAdd: {
    authenticationKey: NewDidVerificationKey;
    encryptionKey: NewDidEncryptionKey;
  },
  keypair: KiltKeyringPair,
  signers: SignerInterface[],
  submitter?: KiltAddress,
): Promise<DidTransaction> {
  const { fullDid: did } = parseDidUri(lightDidDocument.id);

  const { authenticationKey, encryptionKey } = keysToAdd;

  const extrinsic = await getStoreTx(
    { authentication: [authenticationKey], keyAgreement: [encryptionKey] },
    submitter || keypair.address,
    signers,
  );

  return { extrinsic, did };
}

export async function getFee(): Promise<BN> {
  const { keypair, signers, authenticationKey, encryptionKey } =
    await makeFakeIdentityCrypto();

  const api = ConfigService.get('api');

  const lightDidDocument = createLightDidDocument({
    authentication: [authenticationKey],
    keyAgreement: [encryptionKey],
  });

  const { extrinsic } = await getTransaction(
    lightDidDocument,
    { authenticationKey, encryptionKey },
    keypair,
    signers,
  );
  const signed = await extrinsic.signAsync(keypair);
  const extrinsicFee = (await signed.paymentInfo(keypair)).partialFee;

  const didCreationFee = api.consts.did.fee;

  return extrinsicFee.add(didCreationFee);
}

export function useKiltCosts(
  address: string,
  did: Did | undefined,
): {
  fee?: BN;
  deposit?: BN;
  total?: BN;
  insufficientKilt: boolean;
} {
  const fee = useAsyncValue(getFee, []);
  const deposit = useAsyncValue(getDepositDid, [did]);

  const total = useMemo(
    () => (fee && deposit ? fee.add(deposit.amount) : undefined),
    [deposit, fee],
  );

  const balance = useAddressBalance(address);
  const insufficientKilt = Boolean(
    total && balance && balance.transferable.lt(total),
  );

  return { fee, deposit: deposit?.amount, total, insufficientKilt };
}

const currentTx: Record<string, DidTransaction> = {};

export async function sign(seed: Uint8Array): Promise<string> {
  const { didDocument, keypair, signers, authenticationKey, encryptionKey } =
    await getIdentityCryptoFromSeed(seed);

  const { extrinsic, did } = await getTransaction(
    didDocument,
    { authenticationKey, encryptionKey },
    keypair,
    signers,
  );

  const signed = await extrinsic.signAsync(keypair);

  const hash = signed.hash.toHex();
  currentTx[hash] = { extrinsic: signed, did };
  return hash;
}

export async function submit(hash: string): Promise<Did> {
  const { extrinsic, did } = currentTx[hash];
  await Blockchain.submitSignedTx(extrinsic);
  delete currentTx[hash];

  return did;
}
