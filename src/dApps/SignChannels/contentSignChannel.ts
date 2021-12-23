import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { checkAccess } from '../checkAccess/checkAccess';

import { injectedSignChannel } from './injectedSignChannel';

type SignInput = SignerPayloadJSON & { origin: string };

type SignOutput = SignerResult;

export const contentSignChannel = new BrowserChannel<SignInput, SignOutput>(
  'dAppSign',
);

export function initContentSignChannel(origin: string): () => void {
  return injectedSignChannel.produce(async ({ dAppName, payload }) => {
    await checkAccess(dAppName, origin);
    return contentSignChannel.get({ ...payload, origin });
  });
}
