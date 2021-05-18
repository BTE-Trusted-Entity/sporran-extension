import { pull } from 'lodash-es';
import {
  InjectedAccount,
  InjectedAccounts,
} from '@polkadot/extension-inject/types';
import { getAccountsResult } from '../AccountsMessages/AccountsMessages';

type CallbackType = Parameters<InjectedAccounts['subscribe']>[0];

export class AccountsInjectedAPI implements InjectedAccounts {
  name: string;
  accounts: InjectedAccount[] = [];

  constructor(name: string) {
    this.name = name;
  }

  async request(): Promise<void> {
    let markReady: () => void;
    const whenReady = new Promise<void>((resolve) => {
      markReady = resolve;
    });

    this.request = () => whenReady; // make sure the following only runs once

    getAccountsResult({ name: this.name }).then((accounts) => {
      markReady();
      this.accounts = accounts;
      this.listeners.forEach((listener) => listener(accounts));
    });

    return whenReady;
  }

  listeners: CallbackType[] = [];

  subscribe(listener: CallbackType): () => void {
    this.request();

    this.listeners.push(listener);
    return () => {
      pull(this.listeners, listener);
    };
  }

  async get(): Promise<InjectedAccount[]> {
    await this.request();
    return this.accounts;
  }
}
