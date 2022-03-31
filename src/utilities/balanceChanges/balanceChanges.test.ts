import { Balance } from '@kiltprotocol/core';

import {
  Balances,
  computeBalance,
  onAddressBalanceChange,
} from './balanceChanges';
import { originalBalancesMock } from './balanceChanges.mock';

jest.unmock('./balanceChanges');

const expectedBalanceStrings = {
  transferable: '1216000000000000',
  usableForFees: '1224000000000000',
  locked: '10000000000000',
  bonded: '8000000000000',
  total: '1234000000000000',
};

describe('balanceChanges', () => {
  describe('computeBalance', () => {
    it('should send runtime message', async () => {
      const { balances } = await computeBalance(
        'address',
        originalBalancesMock,
      );

      expect(expectedBalanceStrings).toEqual({
        bonded: balances.bonded.toString(),
        transferable: balances.transferable.toString(),
        usableForFees: balances.usableForFees.toString(),
        locked: balances.locked.toString(),
        total: balances.total.toString(),
      });
    });
  });

  describe('onAddressBalanceChange', () => {
    it('should start listening when called', async () => {
      onAddressBalanceChange('address', jest.fn());

      expect(Balance.listenToBalanceChanges).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
    });

    it('should run publisher on balance change', async () => {
      jest.mocked(Balance.listenToBalanceChanges).mockClear();

      const publisher = jest.fn();
      onAddressBalanceChange('address', publisher);

      jest
        .mocked(Balance.listenToBalanceChanges)
        .mock.calls[0][1]('address', originalBalancesMock, {} as Balances);

      const { balances } = publisher.mock.calls[0][1];
      expect(expectedBalanceStrings).toEqual({
        bonded: balances.bonded.toString(),
        transferable: balances.transferable.toString(),
        usableForFees: balances.usableForFees.toString(),
        locked: balances.locked.toString(),
        total: balances.total.toString(),
      });
    });
  });
});
