import { createContext, useState, useEffect } from 'react';
import useSWR from 'swr';

import { Credential, getList, LIST_KEY, getCredentials } from './credentials';

export const CredentialsContext = createContext<Credential[]>([]);

export function CredentialsProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  const { data: list } = useSWR(LIST_KEY, getList);
  useEffect(() => {
    (async () => {
      if (!list) {
        return;
      }
      setCredentials(await getCredentials(list));
    })();
  }, [list]);
  return (
    <CredentialsContext.Provider value={credentials}>
      {children}
    </CredentialsContext.Provider>
  );
}
