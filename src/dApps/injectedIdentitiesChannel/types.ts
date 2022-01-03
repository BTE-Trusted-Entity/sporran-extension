import { InjectedAccount } from '@polkadot/extension-inject/types';

import { DAppName } from '../AccessChannels/DAppName';

export type IdentitiesInput = DAppName;

export type IdentitiesOutput = InjectedAccount[];
