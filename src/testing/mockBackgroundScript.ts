import { browser } from 'webextension-polyfill-ts';
import { pull } from 'lodash-es';

import {
  FeeMessageType,
  FeeRequest,
} from '../connection/FeeMessages/FeeMessages';
import {
  BalanceChangeRequest,
  BalanceChangeResponse,
  BalanceMessageType,
} from '../connection/BalanceMessages/BalanceMessages';

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

  namespace.runtime.sendMessage = ((
    message: BalanceChangeRequest | FeeRequest,
  ) => {
    if (message.type === FeeMessageType.feeRequest) {
      return Promise.resolve('125000000');
    }

    listeners.forEach((callback) => {
      const response = {
        type: BalanceMessageType.balanceChangeResponse,
        data: {
          address: (message as BalanceChangeRequest).data.address,
          balance: '1234000000000000',
        },
      } as BalanceChangeResponse;

      callback(response, {});
    });
  }) as SendMessageType;
}
