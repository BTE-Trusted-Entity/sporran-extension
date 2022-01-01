import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { DAppName } from '../AccessChannels/DAppName';

export type SignPopupInput = SignerPayloadJSON &
  DAppName & {
    id: number;
    origin: string;
  };

export type SignPopupOutput = SignerResult;
