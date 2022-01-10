import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
  dotsama: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
  dotsama: false,
};

export const internalFeatures: Features = {
  endpoint: true,
  dotsama: true,
};

// Duplicates the value in src/static/manifest.json
// We can’t use browser.runtime.getManifest().version, as it’s unavailable in injected scripts
const version = '2022.1.10';

export const configuration: ConfigurationType = {
  version,
  features: isInternal ? internalFeatures : publicFeatures,
};
