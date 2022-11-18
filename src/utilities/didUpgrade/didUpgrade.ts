import BN from 'bn.js';
import { DidUri, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { Chain, FullDidCreationBuilder } from '@kiltprotocol/did';

import { u32 } from '@polkadot/types';

import { useMemo } from 'react';

import {
  getKeystoreFromSeed,
  getLightDidFromSeed,
  getKeypairBySeed,
} from '../identities/identities';
import { getDidEncryptionKey, parseDidUri } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { useAddressBalance } from '../../components/Balance/Balance';
import { getDepositDid } from '../getDeposit/getDeposit';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: DidUri;
}

export async function getDeposit(): Promise<BN> {
  return Chain.queryDepositAmount();
}

export async function getTransaction(
  seed: Uint8Array,
  submitter?: string,
): Promise<DidTransaction> {
  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);

  const lightDidDetails = getLightDidFromSeed(seed);

  const { fullDid: did } = parseDidUri(lightDidDetails.uri);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const encryptionKey = getDidEncryptionKey(lightDidDetails);

  const extrinsic = await new FullDidCreationBuilder(
    blockchain.api,
    lightDidDetails.authenticationKey,
  )
    .addEncryptionKey(encryptionKey)
    .build(keystore, submitter || keypair.address);

  return { extrinsic, did };
}

export async function getFee(): Promise<BN> {
  const fakeSeed = new Uint8Array(32);
  const keypair = getKeypairBySeed(fakeSeed);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const { extrinsic } = await getTransaction(fakeSeed);
  const signed = await blockchain.signTx(keypair, extrinsic);
  const extrinsicFee = (await signed.paymentInfo(keypair)).partialFee;

  const didCreationFee = blockchain.api.consts.did.fee as u32;

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
  const { extrinsic, did } = await getTransaction(seed);
  const keypair = getKeypairBySeed(seed);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const signed = await blockchain.signTx(keypair, extrinsic);

  const hash = signed.hash.toHex();
  currentTx[hash] = { extrinsic: signed, did };
  return hash;
}

export async function submit(hash: string): Promise<DidUri> {
  const { extrinsic, did } = currentTx[hash];
  await BlockchainUtils.submitSignedTx(extrinsic, {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];

  return did;
}
