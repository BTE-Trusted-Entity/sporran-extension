import { createContext, useState, useEffect } from 'react';
import useSWR from 'swr';

import {
  getAllCredentials,
  Credential,
  getList,
  LIST_KEY,
} from './credentials';

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
      setCredentials(await getAllCredentials(list));
    })();
  }, [list]);
  console.log('value: ', credentials);
  return (
    <CredentialsContext.Provider value={credentials}>
      {children}
    </CredentialsContext.Provider>
  );
}
