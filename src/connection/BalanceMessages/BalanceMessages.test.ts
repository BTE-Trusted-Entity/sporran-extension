import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import {
  BalanceChangeRequest,
  BalanceChangeResponse,
  balanceMessageListener,
  BalanceMessageType,
  onBalanceChange,
} from './BalanceMessages';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.spyOn(browser.runtime, 'sendMessage');

describe('BalanceMessages', () => {
  describe('onChange', () => {
    it('should send runtime message', async () => {
      await onBalanceChange('address', new BN(1.234e15));

      expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
        type: BalanceMessageType.balanceChangeResponse,
        data: {
          address: 'address',
          balance: '1234000000000000',
        },
      } as BalanceChangeResponse);
    });
  });

  describe('balanceMessageListener', () => {
    it('should start listening when called', async () => {
      balanceMessageListener({
        type: BalanceMessageType.balanceChangeRequest,
        data: { address: 'address' },
      });

      expect(listenToBalanceChanges).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
    });
    it('should ignore other messages', async () => {
      (listenToBalanceChanges as jest.Mock).mockClear();

      balanceMessageListener(({
        type: 'other',
        data: { address: 'address' },
      } as unknown) as BalanceChangeRequest);

      expect(listenToBalanceChanges).not.toHaveBeenCalled();
    });
  });
});
