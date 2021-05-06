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
      await onBalanceChange('address', new BN(1.234e15));

      expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
        type: balanceChangeResponse,
        data: {
          address: 'address',
          balance: '1234000000000000',
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
