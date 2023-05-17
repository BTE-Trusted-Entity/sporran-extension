import { DidUri } from '@kiltprotocol/sdk-js';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type ShareIdentitiesInput = DAppName;

export type ShareIdentitiesOriginInput = ShareIdentitiesInput & Origin;

export type ShareIdentitiesOutput = Array<{ did: DidUri; name?: string }>;
