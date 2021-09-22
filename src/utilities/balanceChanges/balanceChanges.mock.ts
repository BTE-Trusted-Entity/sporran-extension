import BN from 'bn.js';

import { Balances } from './balanceChanges';

export const originalBalancesMock: Balances = {
  free: new BN(1.226e15),
  miscFrozen: new BN(0.01e15),
  feeFrozen: new BN(0.002e15),
  reserved: new BN(0.008e15),
};
