import BN from 'bn.js';
import {
  Blockchain,
  ConfigService,
  Did,
  DidDocument,
  DidUri,
  KiltAddress,
  KiltKeyringPair,
  SignExtrinsicCallback,
  SubmittableExtrinsic,
} from '@kiltprotocol/sdk-js';

import { useMemo } from 'react';

import {
  getIdentityCryptoFromSeed,
  getLightDidFromSeed,
} from '../identities/identities';
import { parseDidUri } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { useAddressBalance } from '../../components/Balance/Balance';
import { getDepositDid } from '../getDeposit/getDeposit';
import { makeFakeIdentityCrypto } from '../makeFakeIdentityCrypto/makeFakeIdentityCrypto';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: DidUri;
}

export async function getTransaction(
  lightDidDocument: DidDocument,
  keypair: KiltKeyringPair,
  sign: SignExtrinsicCallback,
  submitter?: KiltAddress,
): Promise<DidTransaction> {
  const { fullDid: did } = parseDidUri(lightDidDocument.uri);

  const extrinsic = await Did.getStoreTx(
    lightDidDocument,
    submitter || keypair.address,
    async (input) => sign({ ...input, did }),
  );

  return { extrinsic, did };
}

export async function getFee(): Promise<BN> {
  const { keypair, sign, fakeSeed } = makeFakeIdentityCrypto();
  const document = getLightDidFromSeed(fakeSeed);

  const api = ConfigService.get('api');

  const { extrinsic } = await getTransaction(document, keypair, sign);
  const extrinsicFee = (await extrinsic.paymentInfo(keypair)).partialFee;

  const didCreationFee = api.consts.did.fee;

  return extrinsicFee.add(didCreationFee);
}

export function useKiltCosts(
  address: string,
  did: DidUri | undefined,
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
  const document = getLightDidFromSeed(seed);
  const { keypair, sign } = await getIdentityCryptoFromSeed(seed);
  const { extrinsic, did } = await getTransaction(document, keypair, sign);

  const signed = await extrinsic.signAsync(keypair);

  const hash = signed.hash.toHex();
  currentTx[hash] = { extrinsic: signed, did };
  return hash;
}

export async function submit(hash: string): Promise<DidUri> {
  const { extrinsic, did } = currentTx[hash];
  await Blockchain.submitSignedTx(extrinsic);
  delete currentTx[hash];

  return did;
}
