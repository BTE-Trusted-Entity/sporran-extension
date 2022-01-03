import {
  SignerPayloadRaw,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { DAppName } from '../AccessChannels/DAppName';
import { Origin } from '../AccessChannels/Origin';

export type SignRawInput = SignerPayloadRaw &
  DAppName & {
    id: number;
  };

export type SignRawOriginInput = SignRawInput & Origin;

export type SignRawOutput = SignerResult;
