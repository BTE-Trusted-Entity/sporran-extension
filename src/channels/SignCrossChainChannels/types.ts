import type { DidUri } from '@kiltprotocol/sdk-js';

import type { DAppName } from '../../dApps/AccessChannels/DAppName';
import type { Origin } from '../../dApps/AccessChannels/Origin';
import type { Value } from '../../utilities/extrinsicDetails/extrinsicDetails';

export type SignCrossChainInput = DAppName & {
  plaintext: string;
  blockNumber: number;
  values: Value[];
  didUri?: DidUri;
};

export type SignCrossChainOriginInput = SignCrossChainInput & Origin;

export interface SignCrossChainOutput {
  signed: string;
}
