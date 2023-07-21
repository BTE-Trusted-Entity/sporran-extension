// src/__mocks__/webextension-polyfill
// Update this file to include any mocks for the `webextension-polyfill` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser

import { setupGetMessageShim } from 'chrome-extension-i18n-shim';

import messagesEN from '../static/_locales/en/messages.json';

export default {
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
      return document.documentElement.lang || 'en';
    },
  },
  storage: {
    local: {
      async get(): Promise<unknown> {
        return {
          authorizedDApps: {
            'example.com': false,
            'examplesuperlong.dfghrtydfghklyuihjwertyxcvbn3456rty56782345678yudfgghtyuwertyudfghsdfgh-domain.org':
              true,
            'example.org': true,
          },
        };
      },
      async set(): Promise<void> {
        // dummy
      },
    },
  },
  runtime: {
    async sendMessage(): Promise<void> {
      // dummy
    },
    onMessage: {
      addListener(): void {
        // dummy
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
