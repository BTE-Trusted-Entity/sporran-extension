import { useContext } from 'react';

import { ConfigurationType } from './configuration';
import { ConfigurationContext } from './ConfigurationContext';

export function useConfiguration(): ConfigurationType {
  return useContext(ConfigurationContext);
}
