import { createContext } from 'react';
import useSWR from 'swr';

import { IdentitiesMap } from './types';
import { getIdentities } from './getIdentities';

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
  const value = useSWR('getIdentities', getIdentities);
  return (
    <IdentitiesContext.Provider value={value}>
      {children}
    </IdentitiesContext.Provider>
  );
}
