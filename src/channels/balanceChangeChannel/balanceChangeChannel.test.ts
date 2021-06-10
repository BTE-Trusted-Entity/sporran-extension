import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { publishBalanceChanges, computeBalance } from './balanceChangeChannel';
import { balanceMock } from './balanceChangeChannel.mock';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.spyOn(browser.runtime, 'sendMessage');
jest.unmock('./balanceChangeChannel');

const originalBalancesMock = {
  free: new BN(1.226e15),
  miscFrozen: new BN(0.004e15),
  feeFrozen: new BN(0.006e15),
  reserved: new BN(0.008e15),
};

describe('balanceChangeChannel', () => {
  describe('computeBalance', () => {
    it('should send runtime message', async () => {
      const result = await computeBalance('address', originalBalancesMock);

      expect(balanceMock).toEqual({
        bonded: result.balances.bonded.toString(),
        free: result.balances.free.toString(),
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
        free: result.balances.free.toString(),
        locked: result.balances.locked.toString(),
        total: result.balances.total.toString(),
      });
    });
  });
});
