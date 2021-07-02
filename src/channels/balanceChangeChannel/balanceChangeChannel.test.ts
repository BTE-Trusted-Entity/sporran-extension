import { browser } from 'webextension-polyfill-ts';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { publishBalanceChanges, computeBalance } from './balanceChangeChannel';
import { balanceMock, originalBalancesMock } from './balanceChangeChannel.mock';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.spyOn(browser.runtime, 'sendMessage');
jest.unmock('./balanceChangeChannel');

describe('balanceChangeChannel', () => {
  describe('computeBalance', () => {
    it('should send runtime message', async () => {
      const result = await computeBalance('address', originalBalancesMock);

      expect(balanceMock).toEqual({
        bonded: result.balances.bonded.toString(),
        transferable: result.balances.transferable.toString(),
        usableForFees: result.balances.usableForFees.toString(),
        locked: result.balances.locked.toString(),
        total: result.balances.total.toString(),
      });
    });
  });

  describe('publishBalanceChanges', () => {
    it('should start listening when called', async () => {
      await publishBalanceChanges('address', jest.fn());

      expect(listenToBalanceChanges).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
    });

    it('should run publisher on balance change', async () => {
      (listenToBalanceChanges as jest.Mock).mockClear();

      const publisher = jest.fn();
      await publishBalanceChanges('address', publisher);

      (listenToBalanceChanges as jest.Mock).mock.calls[0][1](
        'address',
        originalBalancesMock,
      );

      const result = publisher.mock.calls[0][1];
      expect(balanceMock).toEqual({
        bonded: result.balances.bonded.toString(),
        transferable: result.balances.transferable.toString(),
        usableForFees: result.balances.usableForFees.toString(),
        locked: result.balances.locked.toString(),
        total: result.balances.total.toString(),
      });
    });
  });
});
