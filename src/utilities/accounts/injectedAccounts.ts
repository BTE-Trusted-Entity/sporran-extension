import { InjectedAccount } from '@polkadot/extension-inject/types';
import { browser, Storage } from 'webextension-polyfill-ts';

import {
  onInjectedAccountsRequest,
  sendInjectedAccountsResponse,
} from '../../connection/InjectedAccountsMessages/InjectedAccountsMessages';
import { storageAreaName } from '../storage/storage';
import { authorize } from '../dApps/authorize';
import { ACCOUNTS_KEY, getAccounts } from './getAccounts';

async function getInjectableAccounts(): Promise<InjectedAccount[]> {
  const accounts = await getAccounts();
  return Object.values(accounts).map(({ name, address }) => ({
    name,
    address,
    type: 'sr25519',
  }));
}

interface Changes {
  [key: string]: Storage.StorageChange;
}

function subscribe(
  callback: (accounts: InjectedAccount[]) => void,
): () => void {
  async function onChanged(changes: Changes, areaName: string) {
    if (areaName !== storageAreaName) {
      return;
    }

    const needToNotify = ACCOUNTS_KEY in changes;
    if (needToNotify) {
      callback(await getInjectableAccounts());
    }
  }

  browser.storage.onChanged.addListener(onChanged);
  return () => browser.storage.onChanged.removeListener(onChanged);
}

export function handleAllInjectedAccountsRequests(origin: string): () => void {
  return onInjectedAccountsRequest(async ({ name }) => {
    await authorize(name, origin);

    subscribe(sendInjectedAccountsResponse);
    await sendInjectedAccountsResponse(await getInjectableAccounts());
  });
}
