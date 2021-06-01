import { pull } from 'lodash-es';
import {
  InjectedAccount,
  InjectedAccounts,
} from '@polkadot/extension-inject/types';
import { injectedAccountsChannel } from '../AccountsChannels/injectedAccountsChannel';

type CallbackType = Parameters<InjectedAccounts['subscribe']>[0];

export class AccountsInjectedAPI implements InjectedAccounts {
  dAppName: string;
  accounts: InjectedAccount[] = [];

  constructor(dAppName: string) {
    this.dAppName = dAppName;
  }

  async request(): Promise<void> {
    let resolve: () => void;
    let reject: (error: Error) => void;
    const whenReady = new Promise<void>((resolveArg, rejectArg) => {
      resolve = resolveArg;
      reject = rejectArg;
    });

    this.request = () => whenReady; // make sure the following only runs once

    injectedAccountsChannel.subscribe(this.dAppName, (error, accounts?) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
      this.accounts = accounts as InjectedAccount[];
      this.listeners.forEach((listener) => listener(this.accounts));
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
