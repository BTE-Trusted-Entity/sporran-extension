import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { Balances } from './balanceChanges';

export const originalBalancesMock: Balances = {
  free: BalanceUtils.toFemtoKilt(1.226),
  miscFrozen: BalanceUtils.toFemtoKilt(0.01),
  feeFrozen: BalanceUtils.toFemtoKilt(0.002),
  reserved: BalanceUtils.toFemtoKilt(0.008),
};
