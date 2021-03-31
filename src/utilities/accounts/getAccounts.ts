import { storage } from './storage';
import { AccountsMap } from './types';

export const ACCOUNTS_KEY = 'accounts';

export async function getAccounts(): Promise<AccountsMap> {
  return (await storage.get(ACCOUNTS_KEY))[ACCOUNTS_KEY] || {};
}
