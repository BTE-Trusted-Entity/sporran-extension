import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import {
  balanceChangeResponse,
  balanceMessageListener,
  onBalanceChange,
} from './BalanceMessages';
import { balanceMock } from './BalanceMessages.mock';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.spyOn(browser.runtime, 'sendMessage');

describe('BalanceMessages', () => {
  describe('onBalanceChange', () => {
    it('should send runtime message', async () => {
      await onBalanceChange('address', {
        free: new BN(1.226e15),
        reserved: new BN(0.005e15),
        miscFrozen: new BN(0.002e15),
        feeFrozen: new BN(0.001e15),
      });

      expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
        type: balanceChangeResponse,
        data: {
          address: 'address',
          balance: balanceMock,
        },
      });
    });
  });

  describe('balanceMessageListener', () => {
    it('should start listening when called', async () => {
      await balanceMessageListener({ address: 'address' });

      expect(listenToBalanceChanges).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
    });
  });
});
