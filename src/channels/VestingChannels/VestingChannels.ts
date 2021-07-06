import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { decryptIdentity } from '../../utilities/identities/identities';
import { transformBalances } from '../../utilities/transformBalances/transformBalances';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface VestInput {
  address: string;
  password: string;
}

const currentTx: Record<string, SubmittableExtrinsic<'promise'>> = {};

export const hasVestedFundsChannel = new BrowserChannel<string, boolean>(
  'hasVestedFunds',
);

export async function hasVestedFunds(address: string): Promise<boolean> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const { isSome } = await api.query.vesting.vesting(address);
  return isSome;
}

export function initBackgroundHasVestedFundsChannel(): void {
  hasVestedFundsChannel.produce(hasVestedFunds);
}

export const signVestChannel = new BrowserChannel<VestInput, string>(
  'signVest',
);

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

export const submitVestChannel = new BrowserChannel<string>('submitVest');

export async function submitVest(hash: string): Promise<void> {
  await BlockchainUtils.submitSignedTx(currentTx[hash], {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];
}

export function initBackgroundVestChannels(): void {
  signVestChannel.produce(signVest);
  submitVestChannel.produce(submitVest);
}
