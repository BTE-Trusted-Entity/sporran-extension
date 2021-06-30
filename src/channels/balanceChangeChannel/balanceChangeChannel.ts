import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { ErrorFirstCallback } from '../base/types';

import { transformBalances } from '../../utilities/transformBalances/transformBalances';

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
    transferable: BN;
    usableForFees: BN;
    locked: BN;
    bonded: BN;
    total: BN;
  };
}

export interface JsonChangeOutput {
  address: string;
  balances: {
    transferable: string;
    usableForFees: string;
    locked: string;
    bonded: string;
    total: string;
  };
}

const transform = {
  outputToJson: ({
    address,
    balances: { transferable, usableForFees, bonded, locked, total },
  }: BalanceChangeOutput) => ({
    address,
    balances: {
      transferable: transferable.toString(),
      usableForFees: usableForFees.toString(),
      locked: locked.toString(),
      bonded: bonded.toString(),
      total: total.toString(),
    },
  }),
  jsonToOutput: ({
    address,
    balances: { transferable, usableForFees, bonded, locked, total },
  }: JsonChangeOutput) => ({
    address,
    balances: {
      transferable: new BN(transferable),
      usableForFees: new BN(usableForFees),
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
  const transformedBalances = transformBalances(balances);

  return {
    address,
    balances: transformedBalances,
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
