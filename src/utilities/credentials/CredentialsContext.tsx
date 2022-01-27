import { createContext, useState, useEffect } from 'react';
import useSWR from 'swr';

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

  const { data: list } = useSWR(LIST_KEY, async () =>
    getCredentials(await getList()),
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
