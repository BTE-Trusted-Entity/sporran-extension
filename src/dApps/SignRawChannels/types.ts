import {
  SignerPayloadRaw,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { DAppName } from '../AccessChannels/DAppName';

export type SignRawInput = SignerPayloadRaw &
  DAppName & {
    id: number;
    origin: string;
  };

export type SignRawOutput = SignerResult;
