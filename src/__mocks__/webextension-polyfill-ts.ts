// src/__mocks__/webextension-polyfill-ts
// Update this file to include any mocks for the `webextension-polyfill-ts` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser

import { setupGetMessageShim } from 'chrome-extension-i18n-shim';
import { pull } from 'lodash-es';
import messagesEN from '../static/_locales/en/messages.json';
import { balanceMock } from '../channels/balanceChangeChannel/balanceChangeChannel.mock';

type CallbackType = (data: unknown, caller: unknown) => void;
const listeners: CallbackType[] = [];

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
    async sendMessage({ input }: { input: string }): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve, 10));

      listeners.forEach((callback) => {
        const response = {
          type: 'balanceChangeOutput',
          output: {
            address: input,
            balances: balanceMock,
          },
        };
        callback(response, {});
      });
    },
    onMessage: {
      addListener(callback: () => void): void {
        listeners.push(callback);
      },
      removeListener(callback: CallbackType): void {
        pull(listeners, callback);
      },
    },
  },
};

export interface Tabs {
  Tab: {
    id: number;
  };
}
