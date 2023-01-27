import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
  recipientsList: boolean;
  checkout: boolean;
  finalized: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
  recipientsList: false,
  checkout: false,
  finalized: true,
};

export const internalFeatures: Features = {
  endpoint: true,
  recipientsList: true,
  checkout: true,
  finalized: false,
};

// Duplicates the value in src/static/manifest.json
// We can’t use browser.runtime.getManifest().version, as it’s unavailable in injected scripts
const version = '2023.1.23';

export const configuration: ConfigurationType = {
  version,
  features: isInternal ? internalFeatures : publicFeatures,
};
