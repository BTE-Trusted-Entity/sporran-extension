import { HexString } from '@polkadot/util/types';

import { DAppName } from '../AccessChannels/DAppName';
import { Origin } from '../AccessChannels/Origin';

export type CreateDidInput = DAppName;

export type CreateDidOriginInput = DAppName & Origin;

export interface CreateDidOutput {
  signed: HexString;
}
