import {
  SignerPayloadRaw,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { checkAccess } from '../checkAccess/checkAccess';

import { injectedSignRawChannel } from './injectedSignRawChannel';

type SignRawInput = SignerPayloadRaw & { origin: string };

type SignRawOutput = SignerResult;

export const contentSignRawChannel = new BrowserChannel<
  SignRawInput,
  SignRawOutput
>('dAppSignRaw');

export function initContentSignRawChannel(origin: string): () => void {
  return injectedSignRawChannel.produce(async ({ dAppName, payload }) => {
    await checkAccess(dAppName, origin);
    return contentSignRawChannel.get({ ...payload, origin });
  });
}
