import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';
import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

interface SignPopupInput {
  dAppName: string;
  payload: SignerPayloadJSON;
}

export const injectedSignChannel = new WindowChannel<
  SignPopupInput,
  SignerResult
>('sign');
