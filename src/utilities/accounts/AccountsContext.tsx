import { createContext } from 'react';
import useSWR from 'swr';

import { AccountsMap } from './types';
import { getAccounts } from './getAccounts';

export interface AccountsContextType {
  data?: AccountsMap;
  error?: string;
}

export const AccountsContext = createContext<AccountsContextType>({});

export function AccountsProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const value = useSWR('accounts', getAccounts);
  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}
