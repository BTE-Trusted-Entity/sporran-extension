import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { ErrorFirstCallback } from '../../channels/base/types';

import { transformBalances } from '../transformBalances/transformBalances';

export interface Balances {
  free: BN;
  miscFrozen: BN;
  feeFrozen: BN;
  reserved: BN;
}

export interface BalanceChange {
  address: string;
  balances: {
    transferable: BN;
    usableForFees: BN;
    locked: BN;
    bonded: BN;
    total: BN;
  };
}

export function computeBalance(
  address: string,
  balances: Balances,
): BalanceChange {
  const transformedBalances = transformBalances(balances);

  return {
    address,
    balances: transformedBalances,
  };
}

export function onAddressBalanceChange(
  address: string,
  publisher: ErrorFirstCallback<BalanceChange>,
): () => void {
  function onBalanceChange(
    responseAddress: string,
    rawBalances: Balances,
  ): void {
    try {
      const balance = computeBalance(responseAddress, rawBalances);
      publisher(null, balance);
    } catch (error) {
      publisher(error instanceof Error ? error : new Error(String(error)));
    }
  }

  const unsubscribePromise = listenToBalanceChanges(address, onBalanceChange);
  return async () => {
    const unsubscribe = await unsubscribePromise;
    unsubscribe();
  };
}
