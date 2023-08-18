import { createContext, PropsWithChildren } from 'react';

import { configuration } from './configuration';

export const ConfigurationContext = createContext(configuration);

export function ConfigurationProvider({ children }: PropsWithChildren) {
  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
}
