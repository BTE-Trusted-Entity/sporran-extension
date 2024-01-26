import type { Did, KiltAddress } from '@kiltprotocol/types';

export interface Identity {
  address: KiltAddress;
  did?: Did;
  name: string;
  index: number;
  deletedDid?: Did;
}

export type IdentitiesMap = Record<string, Identity>;
