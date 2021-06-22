export interface Identity {
  address: string;
  name: string;
  index: number;
}

export type IdentitiesMap = Record<string, Identity>;
