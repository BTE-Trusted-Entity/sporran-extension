import { pull } from 'lodash-es';
import {
  InjectedAccount,
  InjectedAccounts,
} from '@polkadot/extension-inject/types';

import { injectedIdentitiesChannel } from '../injectedIdentitiesChannel/injectedIdentitiesChannel';
import { makeControlledPromise } from '../../utilities/makeControlledPromise/makeControlledPromise';

type CallbackType = Parameters<InjectedAccounts['subscribe']>[0];

export class IdentitiesInjectedAPI implements InjectedAccounts {
  dAppName: string;
  identities: InjectedAccount[] = [];

  constructor(dAppName: string) {
    this.dAppName = dAppName;
  }

  async request(): Promise<void> {
    const result = makeControlledPromise<void>();

    this.request = () => result.promise; // make sure the following only runs once

    const { dAppName } = this;
    injectedIdentitiesChannel.subscribe({ dAppName }, (error, identities?) => {
      if (error) {
        result.reject(error);
        return;
      }
      result.resolve();
      this.identities = identities as InjectedAccount[];
      this.listeners.forEach((listener) => listener(this.identities));
    });

    await result.promise;
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
    return this.identities;
  }
}
