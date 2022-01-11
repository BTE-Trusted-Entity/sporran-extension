import BN from 'bn.js';

import { onAddressBalanceChange } from './balanceChanges';

jest.mock('./balanceChanges');

export function mockBalanceChanges(): void {
  jest
    .mocked(onAddressBalanceChange)
    .mockImplementation((address, publisher) => {
      publisher(null, {
        address,
        balances: {
          bonded: new BN('8000000000000'),
          transferable: new BN('1216000000000000'),
          usableForFees: new BN('1224000000000000'),
          locked: new BN('10000000000000'),
          total: new BN('1234000000000000'),
        },
      });
      return () => null;
    });
}
