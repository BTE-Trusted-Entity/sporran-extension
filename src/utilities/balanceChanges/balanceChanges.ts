import BN from 'bn.js';
import { ConfigService } from '@kiltprotocol/sdk-js';

import { ErrorFirstCallback } from '../../channels/base/types';

import { transformBalances, transformBalancesV2 } from '../transformBalances/transformBalances';
import { exceptionToError } from '../exceptionToError/exceptionToError';

export interface BalancesV1 {
  free: BN;
  miscFrozen: BN;
  feeFrozen: BN;
  reserved: BN;
}

export interface BalancesV2 {
  free: BN;
  reserved: BN;
  frozen: BN;
  flag: BN;
}

function isBalancesV2(obj: any): obj is BalancesV2 {
  return (
    typeof obj === 'object' &&
    'free' in obj && obj.free instanceof BN &&
    'reserved' in obj && obj.reserved instanceof BN &&
    'frozen' in obj && obj.frozen instanceof BN &&
    'flags' in obj && obj.flags instanceof BN
  );
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
  balances: BalancesV2 | BalancesV1,
): BalanceChange {

  const transformedBalances = isBalancesV2(balances)
    ? transformBalancesV2(balances)
    : transformBalances(balances);

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
    rawBalances: BalancesV2 | BalancesV1,
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
