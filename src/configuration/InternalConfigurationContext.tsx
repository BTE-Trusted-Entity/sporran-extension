import { PropsWithChildren } from 'react';

import { ConfigurationContext } from './ConfigurationContext';
import { configuration, internalFeatures } from './configuration';

const internalConfiguration = {
  ...configuration,
  features: internalFeatures,
};

export function InternalConfigurationContext({ children }: PropsWithChildren) {
  return (
    <ConfigurationContext.Provider value={internalConfiguration}>
      {children}
    </ConfigurationContext.Provider>
  );
}
