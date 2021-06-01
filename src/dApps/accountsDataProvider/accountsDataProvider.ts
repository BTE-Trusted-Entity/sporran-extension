import { InjectedAccount } from '@polkadot/extension-inject/types';
import { browser, Storage } from 'webextension-polyfill-ts';

import { injectedAccountsChannel } from '../AccountsChannels/injectedAccountsChannel';
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
  handleAccounts: (accounts: InjectedAccount[]) => void,
): () => void {
  async function handleChanges(changes: Changes, areaName: string) {
    if (areaName !== storageAreaName) {
      return;
    }

    const needToNotify = ACCOUNTS_KEY in changes;
    if (needToNotify) {
      handleAccounts(await getAccountsForInjectedAPI());
    }
  }

  browser.storage.onChanged.addListener(handleChanges);
  return () => browser.storage.onChanged.removeListener(handleChanges);
}

export function initContentAccountsChannel(origin: string): () => void {
  return injectedAccountsChannel.publish(async (dAppName, publisher) => {
    await checkAccess(dAppName, origin);
    publisher(null, await getAccountsForInjectedAPI());
    return subscribe((accounts) => publisher(null, accounts));
  });
}
