import { DidUri, KiltAddress } from '@kiltprotocol/types';

export interface Identity {
  address: KiltAddress;
  name: string;
  index: number;
  did?: DidUri;
}

export type IdentitiesMap = Record<string, Identity>;
