import { BalanceUtils } from '@kiltprotocol/sdk-js';

import { Balances } from './balanceChanges';

export const originalBalancesMock: Balances = {
  free: BalanceUtils.toFemtoKilt(1.226),
  miscFrozen: BalanceUtils.toFemtoKilt(0.01),
  feeFrozen: BalanceUtils.toFemtoKilt(0.002),
  reserved: BalanceUtils.toFemtoKilt(0.008),
};
