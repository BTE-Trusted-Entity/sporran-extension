import { pull } from 'lodash-es';
import {
  InjectedAccount,
  InjectedAccounts,
  Unsubcall,
} from '@polkadot/extension-inject/types';
import { getInjectedAccountsResult } from '../../connection/InjectedAccountsMessages/InjectedAccountsMessages';

type CallbackType = Parameters<InjectedAccounts['subscribe']>[0];

export class InjectedSporranAccounts implements InjectedAccounts {
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

    getInjectedAccountsResult({ name: this.name }).then((accounts) => {
      markReady();
      this.accounts = accounts;
      this.listeners.forEach((listener) => listener(accounts));
    });

    return whenReady;
  }

  listeners: CallbackType[] = [];

  subscribe(callback: CallbackType): Unsubcall {
    this.request();

    this.listeners.push(callback);
    return () => {
      pull(this.listeners, callback);
    };
  }

  async get(): Promise<InjectedAccount[]> {
    await this.request();
    return this.accounts;
  }
}
