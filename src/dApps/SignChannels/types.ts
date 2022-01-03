import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { DAppName } from '../AccessChannels/DAppName';
import { Origin } from '../AccessChannels/Origin';

export type SignInput = SignerPayloadJSON &
  DAppName & {
    id: number;
  };

export type SignOriginInput = SignInput & Origin;

export type SignOutput = SignerResult;
