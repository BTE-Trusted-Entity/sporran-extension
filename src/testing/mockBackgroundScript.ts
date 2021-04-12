import { browser } from 'webextension-polyfill-ts';
import { pull } from 'lodash-es';

import {
  BalanceChangeRequest,
  BalanceChangeResponse,
  MessageType,
} from '../connection/MessageType';

type CallbackType = Parameters<typeof browser.runtime.onMessage.addListener>[0];
type SendMessageType = Parameters<typeof browser.runtime.sendMessage>[0];

export function mockBackgroundScript(): void {
  const listeners: CallbackType[] = [];

  browser.runtime.onMessage.addListener = (callback: CallbackType) => {
    listeners.push(callback);
  };

  browser.runtime.onMessage.removeListener = (callback: CallbackType) => {
    pull(listeners, callback);
  };

  browser.runtime.sendMessage = ((message: BalanceChangeRequest) => {
    listeners.forEach((callback) => {
      const response = {
        type: MessageType.balanceChangeResponse,
        data: {
          address: message.data.address,
          balance: '04625103a72000',
        },
      } as BalanceChangeResponse;

      callback(response, {});
    });
  }) as SendMessageType;
}
