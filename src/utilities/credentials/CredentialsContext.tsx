import { createContext, JSX, useState, useEffect } from 'react';

import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import {
  SporranCredential,
  getList,
  LIST_KEY,
  getCredentials,
} from './credentials';

export const CredentialsContext = createContext<
  SporranCredential[] | undefined
>(undefined);

export function CredentialsProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
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
