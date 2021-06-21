export interface Account {
  address: string;
  name: string;
  index: number;
}

export type AccountsMap = Record<string, Account>;
