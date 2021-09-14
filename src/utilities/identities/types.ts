export interface Identity {
  address: string;
  did: string;
  name: string;
  index: number;
}

export type IdentitiesMap = Record<string, Identity>;
