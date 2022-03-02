import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
  dotsama: boolean;
  presentation: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
  dotsama: false,
  presentation: false,
};

export const internalFeatures: Features = {
  endpoint: true,
  dotsama: true,
  presentation: true,
};

// Duplicates the value in src/static/manifest.json
// We can’t use browser.runtime.getManifest().version, as it’s unavailable in injected scripts
const version = '2022.3.2';

export const configuration: ConfigurationType = {
  version,
  features: isInternal ? internalFeatures : publicFeatures,
};
