import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import {
  balanceChangeResponse,
  balanceMessageListener,
  onBalanceChange,
} from './BalanceMessages';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.spyOn(browser.runtime, 'sendMessage');

describe('BalanceMessages', () => {
  describe('onBalanceChange', () => {
    it('should send runtime message', async () => {
      await onBalanceChange('address', {
        free: new BN(1.231e15),
        reserved: new BN(0.001e15),
        miscFrozen: new BN(0.001e15),
        feeFrozen: new BN(0.001e15),
      });

      expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
        type: balanceChangeResponse,
        data: {
          address: 'address',
          balance: {
            free: '1231000000000000',
            bonded: '1000000000000',
            locked: '2000000000000',
            total: '1234000000000000',
          },
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
