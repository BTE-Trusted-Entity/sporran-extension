import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { Balance } from '@kiltprotocol/core';
import { SubmittableExtrinsic } from '@kiltprotocol/types';
import { KeyringPair } from '@polkadot/keyring/types';

import { transformBalances } from '../transformBalances/transformBalances';

type VestInput = KeyringPair;

const currentTx: Record<string, SubmittableExtrinsic> = {};

export async function hasVestedFunds(address: string): Promise<boolean> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const { isSome } = await api.query.vesting.vesting(address);
  return isSome;
}

export const insufficientFunds = 'Insufficient funds';

export async function signVest(keypair: VestInput): Promise<string> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const { api } = blockchain;

  const tx = api.tx.vesting.vest();
  const signedTx = await blockchain.signTx(keypair, tx);

  const fee = (await signedTx.paymentInfo(keypair)).partialFee;
  const { usableForFees } = transformBalances(
    await Balance.getBalances(keypair.address),
  );

  if (usableForFees.lt(fee)) {
    throw new Error(insufficientFunds);
  }

  const hash = signedTx.hash.toHex();
  currentTx[hash] = signedTx;
  return hash;
}

export async function submitVest(hash: string): Promise<void> {
  await BlockchainUtils.submitSignedTx(currentTx[hash], {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];
}
