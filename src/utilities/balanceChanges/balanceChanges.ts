import BN from 'bn.js';
import { ConfigService } from '@kiltprotocol/config';

import { ErrorFirstCallback } from '../../channels/base/types';

import { transformBalances } from '../transformBalances/transformBalances';
import { exceptionToError } from '../exceptionToError/exceptionToError';

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
    } catch (exception) {
      publisher(exceptionToError(exception));
    }
  }

  const api = ConfigService.get('api');
  const unsubscribePromise = api.query.system.account(address, ({ data }) => {
    onBalanceChange(address, data);
  });
  return async () => {
    const unsubscribe = await unsubscribePromise;
    unsubscribe();
  };
}
