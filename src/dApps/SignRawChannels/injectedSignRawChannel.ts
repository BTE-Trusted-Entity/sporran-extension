import {
  SignerPayloadRaw,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

interface SignRawPopupInput {
  dAppName: string;
  payload: SignerPayloadRaw;
}

export const injectedSignRawChannel = new WindowChannel<
  SignRawPopupInput,
  SignerResult
>('signRaw');
