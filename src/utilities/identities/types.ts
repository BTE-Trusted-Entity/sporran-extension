import { DidUri } from '@kiltprotocol/types';

export interface Identity {
  address: string;
  did: DidUri;
  name: string;
  index: number;
}

export type IdentitiesMap = Record<string, Identity>;
