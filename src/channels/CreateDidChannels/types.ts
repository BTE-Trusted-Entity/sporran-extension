import { DidUri, KiltAddress } from '@kiltprotocol/sdk-js';
import { HexString } from '@polkadot/util/types';

import { DAppName } from '../AccessChannels/DAppName';
import { Origin } from '../AccessChannels/Origin';

export type CreateDidInput = DAppName & {
  submitter: KiltAddress;
  pendingDidUri?: DidUri;
};

export type CreateDidOriginInput = CreateDidInput & Origin;

export interface CreateDidOutput {
  signedExtrinsic: HexString;
}
