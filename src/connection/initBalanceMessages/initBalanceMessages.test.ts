import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import {
  BalanceChangeRequest,
  BalanceChangeResponse,
  MessageType,
} from '../MessageType';
import { balanceListener, onChange } from './initBalanceMessages';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.spyOn(browser.runtime, 'sendMessage');

describe('initBalanceMessages', () => {
  describe('onChange', () => {
    it('should send runtime message', async () => {
      await onChange('address', new BN(1.234e15));

      expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
        type: MessageType.balanceChangeResponse,
        data: {
          address: 'address',
          balance: '1234000000000000',
        },
      } as BalanceChangeResponse);
    });
  });

  describe('balanceListener', () => {
    it('should start listening when called', async () => {
      balanceListener({
        type: MessageType.balanceChangeRequest,
        data: { address: 'address' },
      } as BalanceChangeRequest);

      expect(listenToBalanceChanges).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
    });
    it('should ignore other messages', async () => {
      (listenToBalanceChanges as jest.Mock).mockClear();

      balanceListener(({
        type: 'other',
        data: { address: 'address' },
      } as unknown) as BalanceChangeRequest);

      expect(listenToBalanceChanges).not.toHaveBeenCalled();
    });
  });
});
