import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
  credentials: boolean;
  sendToken: boolean;
  subscan: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
  credentials: false,
  sendToken: false,
  subscan: false,
};

export const internalFeatures: Features = {
  endpoint: true,
  credentials: true,
  sendToken: true,
  subscan: true,
};

// Duplicates the value in src/static/manifest.json
// We can’t use browser.runtime.getManifest().version, as it’s unavailable in injected scripts
const version = '2021.11.09';

export const configuration: ConfigurationType = {
  version,
  features: isInternal ? internalFeatures : publicFeatures,
};
