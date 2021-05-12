import { useContext } from 'react';
import useSWR, { mutate, SWRResponse } from 'swr';
import { Identity } from '@kiltprotocol/core';
import { map, max } from 'lodash-es';

import {
  loadEncrypted,
  saveEncrypted,
} from '../storageEncryption/storageEncryption';
import { AccountsContext, AccountsContextType } from './AccountsContext';
import { storage } from '../storage/storage';
import { ACCOUNTS_KEY, getAccounts } from './getAccounts';
import { getNextTartan, updateNextTartan } from './tartans';

import { Account, AccountsMap } from './types';

export { Account, AccountsMap } from './types';

const CURRENT_ACCOUNT_KEY = 'currentAccount';

export const NEW: Account = {
  address: 'NEW',
  name: '',
  tartan: '',
  index: -1,
};

export function isNew(account: Account): boolean {
  return account === NEW;
}

export function useAccounts(): AccountsContextType {
  return useContext(AccountsContext);
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

export async function removeAccount(account: Account): Promise<void> {
  const accounts = await getAccounts();
  delete accounts[account.address];

  await storage.set({ [ACCOUNTS_KEY]: accounts });
  await storage.remove(account.address);

  await mutate(ACCOUNTS_KEY);

  await getCurrentAccount();
}

export async function encryptAccount(
  backupPhrase: string,
  password: string,
): Promise<string> {
  const { address, seed } = Identity.buildFromMnemonic(backupPhrase);
  await saveEncrypted(address, password, seed);
  return address;
}

export async function createAccount(
  backupPhrase: string,
  password: string,
): Promise<Account> {
  const address = await encryptAccount(backupPhrase, password);

  const accounts = await getAccounts();
  const largestIndex = max(map(accounts, 'index')) || 0;

  const index = 1 + largestIndex;

  const tartan = await getNextTartan();
  const name = tartan;

  const account = { name, tartan, address, index };
  await saveAccount(account);

  await updateNextTartan();

  return account;
}

export async function decryptAccount(
  address: string,
  password: string,
): Promise<Identity> {
  const seed = await loadEncrypted(address, password);
  return Identity.buildFromSeed(new Uint8Array(seed));
}
