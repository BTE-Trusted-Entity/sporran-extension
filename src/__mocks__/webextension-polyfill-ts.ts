// src/__mocks__/webextension-polyfill-ts
// Update this file to include any mocks for the `webextension-polyfill-ts` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser

import messagesEN from '../static/_locales/en/messages.json';
import { BalanceChangeResponse, MessageType } from '../connection/MessageType';

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
    getMessage(
      messageName: keyof typeof messagesEN,
      // substitutions?: any,
    ): string {
      const messageData = messagesEN[messageName];
      return messageData ? messageData.message : `[[${messageName}]]`;
    },
    getUILanguage(): string {
      return 'en-US';
    },
  },
  storage: {
    local: {
      async get(): Promise<unknown> {
        return {};
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
          type: MessageType.balanceChangeResponse,
          data: { balance: '04625103a72000' },
        } as BalanceChangeResponse;
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
