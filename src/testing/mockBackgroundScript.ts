import { browser } from 'webextension-polyfill-ts';
import { pull } from 'lodash-es';

import { feeRequest, FeeRequest } from '../connection/FeeMessages/FeeMessages';
import {
  BalanceChangeRequest,
  balanceChangeResponse,
  BalanceChangeResponse,
} from '../connection/BalanceMessages/BalanceMessages';
import { balanceMock } from '../connection/BalanceMessages/BalanceMessages.mock';

type CallbackType = Parameters<typeof browser.runtime.onMessage.addListener>[0];
type SendMessageType = Parameters<typeof browser.runtime.sendMessage>[0];

export function mockBackgroundScript(namespace = browser): void {
  const listeners: CallbackType[] = [];

  namespace.runtime.onMessage.addListener = (callback: CallbackType) => {
    listeners.push(callback);
  };

  namespace.runtime.onMessage.removeListener = (callback: CallbackType) => {
    pull(listeners, callback);
  };

  namespace.runtime.sendMessage = ((message: {
    type: string;
    data: BalanceChangeRequest | FeeRequest;
  }) => {
    if (message.type === feeRequest) {
      return Promise.resolve('125000000');
    }

    listeners.forEach((callback) => {
      const response = {
        type: balanceChangeResponse,
        data: {
          address: (message.data as BalanceChangeRequest).address,
          balance: balanceMock,
        } as BalanceChangeResponse,
      };

      callback(response, {});
    });
  }) as SendMessageType;
}
