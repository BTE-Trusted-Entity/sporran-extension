import { BalanceUtils } from '@kiltprotocol/sdk-js';

import { BalancesV1 } from './balanceChanges';

export const originalBalancesMock: BalancesV1 = {
  free: BalanceUtils.toFemtoKilt(1.226),
  miscFrozen: BalanceUtils.toFemtoKilt(0.01),
  feeFrozen: BalanceUtils.toFemtoKilt(0.002),
  reserved: BalanceUtils.toFemtoKilt(0.008),
};
