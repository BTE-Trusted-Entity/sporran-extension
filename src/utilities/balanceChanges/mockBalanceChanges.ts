import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { onAddressBalanceChange } from './balanceChanges';

jest.mock('./balanceChanges');

export function mockBalanceChanges(): void {
  jest
    .mocked(onAddressBalanceChange)
    .mockImplementation((address, publisher) => {
      publisher(null, {
        address,
        balances: {
          bonded: BalanceUtils.toFemtoKilt(0.008),
          transferable: BalanceUtils.toFemtoKilt(1.216),
          usableForFees: BalanceUtils.toFemtoKilt(1.224),
          locked: BalanceUtils.toFemtoKilt(0.01),
          total: BalanceUtils.toFemtoKilt(1.234),
        },
      });
      return () => null; // eslint-disable-line react/display-name
    });
}
