import { isInternal } from './variant';

interface Features {
  endpoint: boolean;
  credentials: boolean;
}

export interface ConfigurationType {
  version: string;
  features: Features;
}

const publicFeatures: Features = {
  endpoint: false,
  credentials: false,
};

export const internalFeatures: Features = {
  endpoint: true,
  credentials: true,
};

export const configuration: ConfigurationType = {
  version: '1.0.0',
  features: isInternal ? internalFeatures : publicFeatures,
};
