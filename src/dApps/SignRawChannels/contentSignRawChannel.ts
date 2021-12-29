import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

import { injectedSignRawChannel } from './injectedSignRawChannel';
import { SignRawPopupInput, SignRawPopupOutput } from './types';

export const contentSignRawChannel = new BrowserChannel<
  SignRawPopupInput,
  SignRawPopupOutput
>('signRaw');

export function initContentSignRawChannel(origin: string): () => void {
  return injectedSignRawChannel.produce(async (input) =>
    contentSignRawChannel.get({ ...input, origin }),
  );
}
