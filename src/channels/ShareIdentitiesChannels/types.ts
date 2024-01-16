import type { Did } from '@kiltprotocol/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type ShareIdentitiesInput = DAppName;

export type ShareIdentitiesOriginInput = ShareIdentitiesInput & Origin;

export type ShareIdentitiesOutput = Array<{ did: Did; name?: string }>;
