import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { ErrorFirstCallback } from '../base/types';

export interface Balances {
  free: BN;
  miscFrozen: BN;
  feeFrozen: BN;
  reserved: BN;
}

type BalanceChangeInput = string;

export interface BalanceChangeOutput {
  address: string;
  balances: {
    free: BN;
    locked: BN;
    bonded: BN;
    total: BN;
  };
}

export interface JsonChangeOutput {
  address: string;
  balances: {
    free: string;
    locked: string;
    bonded: string;
    total: string;
  };
}

const transform = {
  outputToJson: ({
    address,
    balances: { free, bonded, locked, total },
  }: BalanceChangeOutput) => ({
    address,
    balances: {
      free: free.toString(),
      locked: locked.toString(),
      bonded: bonded.toString(),
      total: total.toString(),
    },
  }),
  jsonToOutput: ({
    address,
    balances: { free, bonded, locked, total },
  }: JsonChangeOutput) => ({
    address,
    balances: {
      free: new BN(free),
      locked: new BN(locked),
      bonded: new BN(bonded),
      total: new BN(total),
    },
  }),
};

export const balanceChangeChannel = new BrowserChannel<
  BalanceChangeInput,
  BalanceChangeOutput,
  BalanceChangeInput,
  JsonChangeOutput
>('balanceChange', true, transform);

export function computeBalance(
  address: string,
  balances: Balances,
): BalanceChangeOutput {
  const { free, reserved, miscFrozen, feeFrozen } = balances;
  const locked = miscFrozen.add(feeFrozen);
  const total = free.add(reserved);

  return {
    address,
    balances: {
      free,
      locked,
      bonded: reserved,
      total,
    },
  };
}

export async function publishBalanceChanges(
  address: BalanceChangeInput,
  publisher: ErrorFirstCallback<BalanceChangeOutput>,
): Promise<() => void> {
  function onBalanceChange(
    responseAddress: string,
    rawBalances: Balances,
  ): void {
    try {
      const balance = computeBalance(responseAddress, rawBalances);
      publisher(null, balance);
    } catch (error) {
      publisher(error);
    }
  }

  return listenToBalanceChanges(address, onBalanceChange);
}

export function initBackgroundBalanceChangeChannel(): void {
  balanceChangeChannel.publish(publishBalanceChanges);
}
