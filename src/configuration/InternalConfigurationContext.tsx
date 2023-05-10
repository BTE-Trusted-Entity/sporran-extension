import { JSX } from 'react';

import { ConfigurationContext } from './ConfigurationContext';
import { configuration, internalFeatures } from './configuration';

const internalConfiguration = {
  ...configuration,
  features: internalFeatures,
};

export function InternalConfigurationContext({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return (
    <ConfigurationContext.Provider value={internalConfiguration}>
      {children}
    </ConfigurationContext.Provider>
  );
}
