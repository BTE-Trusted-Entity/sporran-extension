import { DidUri, KiltAddress } from '@kiltprotocol/sdk-js';

export interface Identity {
  address: KiltAddress;
  did?: DidUri;
  name: string;
  index: number;
  deletedDid?: DidUri;
}

export type IdentitiesMap = Record<string, Identity>;
