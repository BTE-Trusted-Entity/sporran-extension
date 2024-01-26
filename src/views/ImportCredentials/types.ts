import type { KiltAddress } from '@kiltprotocol/types';

export interface Import {
  fileName: string;
}

export interface SuccessfulImport extends Import {
  identityAddress: KiltAddress;
}

export interface FailedImport extends Import {
  error: 'invalid' | 'orphaned' | string;
}
