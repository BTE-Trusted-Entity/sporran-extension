import { InjectedAccount } from '@polkadot/extension-inject/types';
import { browser, Storage } from 'webextension-polyfill-ts';

import {
  onAccountsRequest,
  sendAccountsResponse,
} from '../AccountsMessages/AccountsMessages';
import { storageAreaName } from '../../utilities/storage/storage';
import {
  ACCOUNTS_KEY,
  getAccounts,
} from '../../utilities/accounts/getAccounts';
import { checkAccess } from '../checkAccess/checkAccess';

async function getAccountsForInjectedAPI(): Promise<InjectedAccount[]> {
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
      callback(await getAccountsForInjectedAPI());
    }
  }

  browser.storage.onChanged.addListener(onChanged);
  return () => browser.storage.onChanged.removeListener(onChanged);
}

export function handleAllAccountsRequests(origin: string): () => void {
  return onAccountsRequest(async ({ name }) => {
    await checkAccess(name, origin);

    subscribe(sendAccountsResponse);
    await sendAccountsResponse(await getAccountsForInjectedAPI());
  });
}
