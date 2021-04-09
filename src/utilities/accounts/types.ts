export interface Account {
  address: string;
  name: string;
  tartan: string;
  index: number;
}

export type AccountsMap = Record<string, Account>;
