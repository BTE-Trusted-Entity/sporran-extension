import { KiltAddress } from '@kiltprotocol/sdk-js';

export interface Import {
  fileName: string;
}

export interface SuccessfulImport extends Import {
  identityAddress: KiltAddress;
}

export interface FailedImport extends Import {
  error: 'invalid' | 'orphaned' | string;
}
