import { IIdentity } from '@kiltprotocol/types';

export interface Import {
  fileName: string;
}

export interface SuccessfulImport extends Import {
  identityAddress: IIdentity['address'];
}

export interface FailedImport extends Import {
  error: 'invalid' | 'orphaned' | string;
}
