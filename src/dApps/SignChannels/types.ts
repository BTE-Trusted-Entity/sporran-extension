import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { DAppName } from '../AccessChannels/DAppName';

export type SignInput = SignerPayloadJSON &
  DAppName & {
    id: number;
    origin: string;
  };

export type SignOutput = SignerResult;
