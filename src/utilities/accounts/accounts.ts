import { browser } from 'webextension-polyfill-ts';
import useSWR, { mutate, SWRResponse } from 'swr';
import { Identity } from '@kiltprotocol/core';

import { saveEncrypted } from '../storageEncryption/storageEncryption';

const storage = browser.storage.local;

const ACCOUNTS_KEY = 'accounts';
const CURRENT_ACCOUNT_KEY = 'currentAccount';

export interface Account {
  address: string;
  name: string;
}

export type AccountsMap = Record<string, Account>;

async function getAccounts(): Promise<AccountsMap> {
  return (await storage.get(ACCOUNTS_KEY))[ACCOUNTS_KEY] || {};
}

export function useAccounts(): SWRResponse<AccountsMap, unknown> {
  return useSWR(ACCOUNTS_KEY, getAccounts);
}

async function getCurrentAccount(): Promise<string | null> {
  const stored = await storage.get([ACCOUNTS_KEY, CURRENT_ACCOUNT_KEY]);
  const accounts = stored[ACCOUNTS_KEY] as AccountsMap;
  const current = stored[CURRENT_ACCOUNT_KEY];

  if (accounts[current]) {
    return current;
  }

  const firstAccount = Object.values(accounts)[0];
  if (!firstAccount) {
    return null;
  }

  await setCurrentAccount(firstAccount.address);

  return firstAccount.address;
}

export async function setCurrentAccount(address: string): Promise<void> {
  const oldAddress = await storage.get(CURRENT_ACCOUNT_KEY);
  if (address === oldAddress[CURRENT_ACCOUNT_KEY]) {
    return;
  }
  await storage.set({ [CURRENT_ACCOUNT_KEY]: address });
  await mutate(CURRENT_ACCOUNT_KEY);
}

export function useCurrentAccount(): SWRResponse<string | null, unknown> {
  return useSWR(CURRENT_ACCOUNT_KEY, getCurrentAccount);
}

export async function saveAccount(account: Account): Promise<void> {
  const accounts = await getAccounts();
  accounts[account.address] = account;
  await storage.set({ [ACCOUNTS_KEY]: accounts });
  await mutate(ACCOUNTS_KEY);
}

export async function createAccount(
  backupPhrase: string,
  password: string,
): Promise<Account> {
  const { address, seed } = Identity.buildFromMnemonic(backupPhrase);
  await saveEncrypted(address, password, seed);

  const name = 'My Sporran Account';
  const account = { name, address };
  await saveAccount(account);
  return account;
}
