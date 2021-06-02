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
  free: BN;
  bonded: BN;
  locked: BN;
  total: BN;
}

export interface JsonChangeOutput {
  free: string;
  bonded: string;
  locked: string;
  total: string;
}

const transform = {
  outputToJson: ({ free, bonded, locked, total }: BalanceChangeOutput) => ({
    free: free.toString(),
    bonded: bonded.toString(),
    locked: locked.toString(),
    total: total.toString(),
  }),
  jsonToOutput: ({ bonded, free, locked, total }: JsonChangeOutput) => ({
    free: new BN(free),
    bonded: new BN(bonded),
    locked: new BN(locked),
    total: new BN(total),
  }),
};

export const balanceChangeChannel = new BrowserChannel<
  BalanceChangeInput,
  BalanceChangeOutput,
  BalanceChangeInput,
  JsonChangeOutput
>('balanceChange', true, transform);

export function computeBalance(balances: Balances): BalanceChangeOutput {
  const { free, reserved, miscFrozen, feeFrozen } = balances;
  const locked = miscFrozen.add(feeFrozen);
  const total = free.add(reserved).add(locked);

  return {
    bonded: reserved,
    free,
    locked,
    total,
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
    if (responseAddress !== address) {
      return;
    }

    try {
      const balance = computeBalance(rawBalances);
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
