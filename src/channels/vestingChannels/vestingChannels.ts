import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { decryptAccount } from '../../utilities/accounts/accounts';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface VestInput {
  address: string;
  password: string;
}

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

export const vestChannel = new BrowserChannel<VestInput>('vest');

export const insufficientFunds = 'Insufficient funds';
export const existentialError = 'Existential error';

export async function vest({ address, password }: VestInput): Promise<void> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  const identity = await decryptAccount(address, password);

  const tx = api.tx.vesting.vest();

  const { partialFee } = await api.rpc.payment.queryInfo(tx.toHex());

  const balance = await getBalances(address);

  if (balance.free.sub(partialFee).isNeg()) {
    throw new Error(insufficientFunds);
  }

  const existentialDeposit = api.consts.balances.existentialDeposit;

  if (balance.free.sub(partialFee).lt(existentialDeposit)) {
    throw new Error(existentialError);
  }

  await BlockchainUtils.signAndSubmitTx(tx, identity, {
    resolveOn: BlockchainUtils.IS_IN_BLOCK,
  });
}

export function initBackgroundVestChannel(): void {
  vestChannel.produce(vest);
}
