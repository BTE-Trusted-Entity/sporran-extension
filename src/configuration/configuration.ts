import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
  recipientsList: boolean;
  finalized: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
  recipientsList: false,
  finalized: true,
};

export const internalFeatures: Features = {
  endpoint: true,
  recipientsList: true,
  finalized: false,
};

// Duplicates the value in src/static/manifest.json
// We can’t use browser.runtime.getManifest().version, as it’s unavailable in injected scripts
const version = '2025.2.6';

export const configuration: ConfigurationType = {
  version,
  features: isInternal ? internalFeatures : publicFeatures,
};
