import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
  credentials: boolean;
  sendToken: boolean;
  subscan: boolean;
  fullDid: boolean;
  dotsama: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
  credentials: true,
  sendToken: true,
  subscan: true,
  fullDid: true,
  dotsama: false,
};

export const internalFeatures: Features = {
  endpoint: true,
  credentials: true,
  sendToken: true,
  subscan: true,
  fullDid: true,
  dotsama: true,
};

// Duplicates the value in src/static/manifest.json
// We can’t use browser.runtime.getManifest().version, as it’s unavailable in injected scripts
const version = '2021.12.9';

export const configuration: ConfigurationType = {
  version,
  features: isInternal ? internalFeatures : publicFeatures,
};
