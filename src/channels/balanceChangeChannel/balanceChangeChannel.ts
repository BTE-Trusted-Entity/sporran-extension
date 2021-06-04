import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { ErrorFirstCallback } from '../base/types';

interface Balances {
  free: BN;
  reserved: BN;
  miscFrozen: BN;
  feeFrozen: BN;
}

type BalanceChangeInput = string;

export interface BalanceChangeOutput {
  address: string;
  balances: {
    free: BN;
    bonded: BN;
    locked: BN;
    total: BN;
  };
}

export interface JsonChangeOutput {
  address: string;
  balances: {
    free: string;
    bonded: string;
    locked: string;
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
      bonded: bonded.toString(),
      locked: locked.toString(),
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
      bonded: new BN(bonded),
      locked: new BN(locked),
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
  const total = free.add(reserved).add(locked);

  return {
    address,
    balances: {
      bonded: reserved,
      free,
      locked,
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
