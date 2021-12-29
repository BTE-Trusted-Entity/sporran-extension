import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { checkAccess } from '../checkAccess/checkAccess';

import { injectedSignRawChannel } from './injectedSignRawChannel';
import { SignRawPopupInput, SignRawPopupOutput } from './types';

export const contentSignRawChannel = new BrowserChannel<
  SignRawPopupInput,
  SignRawPopupOutput
>('signRaw');

export function initContentSignRawChannel(origin: string): () => void {
  return injectedSignRawChannel.produce(async (input) => {
    await checkAccess(input.dAppName, origin);
    return contentSignRawChannel.get({ ...input, origin });
  });
}
