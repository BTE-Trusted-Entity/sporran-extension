// src/__mocks__/webextension-polyfill-ts
// Update this file to include any mocks for the `webextension-polyfill-ts` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser

import { setupGetMessageShim } from 'chrome-extension-i18n-shim';
import messagesEN from '../static/_locales/en/messages.json';
import {
  balanceChangeResponse,
  BalanceChangeResponse,
} from '../connection/BalanceMessages/BalanceMessages';

export const browser = {
  tabs: {
    executeScript(
      currentTabId: number /* eslint-disable-line @typescript-eslint/no-unused-vars */,
      details: unknown /* eslint-disable-line @typescript-eslint/no-unused-vars */,
    ): Promise<{ done: boolean }> {
      return Promise.resolve({ done: true });
    },
  },
  i18n: {
    getMessage: setupGetMessageShim(messagesEN),
    getUILanguage(): string {
      return 'en-US';
    },
  },
  storage: {
    local: {
      async get(
        keys: null | string | Record<string, unknown> | string[],
      ): Promise<unknown> {
        return keys === 'nextTartan' ? { nextTartan: 'MacLeod' } : {};
      },
      async set(): Promise<void> {
        // dummy
      },
    },
  },
  runtime: {
    sendMessage(): void {
      // dummy
    },
    onMessage: {
      addListener(callback: (...args: unknown[]) => void): void {
        const response = {
          type: balanceChangeResponse,
          data: {
            address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
            balance: '1234000000000000',
          } as BalanceChangeResponse,
        };
        callback(response, {});
      },
      removeListener(): void {
        // dummy
      },
    },
  },
};

export interface Tabs {
  Tab: {
    id: number;
  };
}
