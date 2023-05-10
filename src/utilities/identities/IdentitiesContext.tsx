import { createContext, JSX } from 'react';
import useSWR from 'swr';

import { IdentitiesMap } from './types';
import { getIdentities, IDENTITIES_KEY } from './getIdentities';

export interface IdentitiesContextType {
  data?: IdentitiesMap;
  error?: string;
}

export const IdentitiesContext = createContext<IdentitiesContextType>({});

export function IdentitiesProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const value = useSWR(IDENTITIES_KEY, getIdentities);
  return (
    <IdentitiesContext.Provider value={value}>
      {children}
    </IdentitiesContext.Provider>
  );
}
