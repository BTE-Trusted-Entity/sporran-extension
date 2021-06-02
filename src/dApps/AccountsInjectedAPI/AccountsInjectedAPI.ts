import { pull } from 'lodash-es';
import {
  InjectedAccount,
  InjectedAccounts,
} from '@polkadot/extension-inject/types';
import { injectedAccountsChannel } from '../AccountsChannels/injectedAccountsChannel';
import { makeControlledPromise } from '../../utilities/makeControlledPromise/makeControlledPromise';

type CallbackType = Parameters<InjectedAccounts['subscribe']>[0];

export class AccountsInjectedAPI implements InjectedAccounts {
  dAppName: string;
  accounts: InjectedAccount[] = [];

  constructor(dAppName: string) {
    this.dAppName = dAppName;
  }

  async request(): Promise<void> {
    const result = makeControlledPromise<void>();

    this.request = () => result.promise; // make sure the following only runs once

    injectedAccountsChannel.subscribe(this.dAppName, (error, accounts?) => {
      if (error) {
        result.reject(error);
        return;
      }
      result.resolve();
      this.accounts = accounts as InjectedAccount[];
      this.listeners.forEach((listener) => listener(this.accounts));
    });

    return result.promise;
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
