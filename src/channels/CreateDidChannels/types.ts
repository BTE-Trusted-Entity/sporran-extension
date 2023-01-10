import { KiltAddress } from '@kiltprotocol/types';
import { HexString } from '@polkadot/util/types';

import { DAppName } from '../AccessChannels/DAppName';
import { Origin } from '../AccessChannels/Origin';

export type CreateDidInput = DAppName & {
  submitter: KiltAddress;
};

export type CreateDidOriginInput = CreateDidInput & Origin;

export interface CreateDidOutput {
  signedExtrinsic: HexString;
}
