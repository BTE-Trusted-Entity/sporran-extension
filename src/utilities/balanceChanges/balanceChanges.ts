import BN from 'bn.js';
import { ConfigService } from '@kiltprotocol/sdk-js';

import { ErrorFirstCallback } from '../../channels/base/types';

import {
  BalancesV1,
  BalancesV2,
  transformBalances,
} from '../transformBalances/transformBalances';
import { exceptionToError } from '../exceptionToError/exceptionToError';

export interface BalanceChange {
  address: string;
  balances: {
    transferable: BN;
    usableForFees: BN;
    frozen: BN;
    bonded: BN;
    total: BN;
  };
}

export function computeBalance(
  address: string,
  balances: BalancesV2 | BalancesV1,
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
