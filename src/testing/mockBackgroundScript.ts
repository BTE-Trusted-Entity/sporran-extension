import { browser } from 'webextension-polyfill-ts';

import { BalanceChangeResponse, MessageType } from '../connection/MessageType';

export function mockBackgroundScript(): void {
  function mockListener(
    callback: Parameters<typeof browser.runtime.onMessage.addListener>[0],
  ) {
    const response = {
      type: MessageType.balanceChangeResponse,
      data: { balance: '04625103a72000' },
    } as BalanceChangeResponse;
    callback(response, {});
  }

  browser.runtime.onMessage.addListener = mockListener;
}
