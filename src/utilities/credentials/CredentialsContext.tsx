import { createContext, useState, useEffect } from 'react';

import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

import { Credential, getList, LIST_KEY, getCredentials } from './credentials';

export const CredentialsContext = createContext<Credential[] | undefined>(
  undefined,
);

export function CredentialsProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [credentials, setCredentials] = useState<Credential[]>();

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
