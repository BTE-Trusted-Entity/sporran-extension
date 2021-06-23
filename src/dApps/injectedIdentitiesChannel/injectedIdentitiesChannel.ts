import { InjectedAccount } from '@polkadot/extension-inject/types';

import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

export type IdentitiesInput = string;

export type IdentitiesOutput = InjectedAccount[];

export const injectedIdentitiesChannel = new WindowChannel<
  IdentitiesInput,
  IdentitiesOutput
>('identities');
