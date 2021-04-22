import { browser } from 'webextension-polyfill-ts';
import { pull } from 'lodash-es';

import {
  BalanceChangeRequest,
  BalanceChangeResponse,
  FeeRequest,
  MessageType,
} from '../connection/MessageType';

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
    if (message.type === MessageType.feeRequest) {
      return Promise.resolve('7735940');
    }

    listeners.forEach((callback) => {
      const response = {
        type: MessageType.balanceChangeResponse,
        data: {
          address: (message as BalanceChangeRequest).data.address,
          balance: '04625103a72000',
        },
      } as BalanceChangeResponse;

      callback(response, {});
    });
  }) as SendMessageType;
}
