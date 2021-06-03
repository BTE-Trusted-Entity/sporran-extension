import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';

import { decryptAccount } from '../../utilities/accounts/accounts';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface VestInput {
  address: string;
  password: string;
}

type VestOutput = string;

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

export const vestChannel = new BrowserChannel<VestInput, VestOutput>('vest');

export async function vest({ address, password }: VestInput): Promise<string> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  try {
    const identity = await decryptAccount(address, password);

    const tx = api.tx.vesting.vest();

    await BlockchainUtils.signAndSubmitTx(tx, identity, {
      resolveOn: BlockchainUtils.IS_IN_BLOCK,
    });
    return '';
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

export function initBackgroundVestChannel(): void {
  vestChannel.produce(vest);
}
