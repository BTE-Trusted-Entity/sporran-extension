import { InjectedAccount } from '@polkadot/extension-inject/types';

import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

export type AccountsInput = string;

export type AccountsOutput = InjectedAccount[];

export const injectedAccountsChannel = new WindowChannel<
  AccountsInput,
  AccountsOutput
>('accounts');
