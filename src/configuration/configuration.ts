import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
};

export const internalFeatures: Features = {
  endpoint: true,
};

// Duplicates the value in src/static/manifest.json
// We can’t use browser.runtime.getManifest().version, as it’s unavailable in injected scripts
const version = '2023.8.10';

export const configuration: ConfigurationType = {
  version,
  features: isInternal ? internalFeatures : publicFeatures,
};
