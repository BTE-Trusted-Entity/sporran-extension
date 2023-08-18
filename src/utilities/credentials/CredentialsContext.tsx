import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import {
  getCredentials,
  getList,
  LIST_KEY,
  SporranCredential,
} from './credentials';

export const CredentialsContext = createContext<
  SporranCredential[] | undefined
>(undefined);

export function CredentialsProvider({ children }: PropsWithChildren) {
  const [credentials, setCredentials] = useState<SporranCredential[]>();

  const list = useSwrDataOrThrow(
    LIST_KEY,
    async () => getCredentials(await getList()),
    'getCredentials',
  );

  useEffect(() => {
    setCredentials(list);
  }, [list]);

  return (
    <CredentialsContext.Provider value={credentials}>
      {children}
    </CredentialsContext.Provider>
  );
}
