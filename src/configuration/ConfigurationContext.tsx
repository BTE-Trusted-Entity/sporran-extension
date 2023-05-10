import { createContext, JSX } from 'react';

import { configuration } from './configuration';

export const ConfigurationContext = createContext(configuration);

export function ConfigurationProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
}
