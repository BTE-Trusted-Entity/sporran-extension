import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';
import { SubmittableExtrinsic } from '@kiltprotocol/types';

import { decryptIdentity } from '../identities/identities';
import { transformBalances } from '../transformBalances/transformBalances';

interface VestInput {
  address: string;
  password: string;
}

const currentTx: Record<string, SubmittableExtrinsic> = {};

export async function hasVestedFunds(address: string): Promise<boolean> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const { isSome } = await api.query.vesting.vesting(address);
  return isSome;
}

export const insufficientFunds = 'Insufficient funds';

export async function signVest({
  address,
  password,
}: VestInput): Promise<string> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const { api } = blockchain;

  const identity = await decryptIdentity(address, password);

  const tx = api.tx.vesting.vest();
  const signedTx = await blockchain.signTx(identity, tx);

  const { partialFee } = await api.rpc.payment.queryInfo(signedTx.toHex());
  const { usableForFees } = transformBalances(await getBalances(address));

  if (usableForFees.lt(partialFee)) {
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
