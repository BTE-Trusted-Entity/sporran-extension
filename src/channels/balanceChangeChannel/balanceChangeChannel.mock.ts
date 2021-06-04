import BN from 'bn.js';

import { JsonChangeOutput, Balances } from './balanceChangeChannel';

export const originalBalancesMock: Balances = {
  free: new BN(1.226e15),
  reserved: new BN(0.005e15),
  miscFrozen: new BN(0.002e15),
  feeFrozen: new BN(0.001e15),
};

export const balanceMock: JsonChangeOutput['balances'] = {
  free: '1226000000000000',
  locked: '10000000000000',
  bonded: '8000000000000',
  total: '1234000000000000',
};
