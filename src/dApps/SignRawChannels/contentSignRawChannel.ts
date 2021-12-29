import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { contentAccessChannel } from '../AccessChannels/contentAccessChannel';

import { injectedSignRawChannel } from './injectedSignRawChannel';
import { SignRawPopupInput, SignRawPopupOutput } from './types';

export const contentSignRawChannel = new BrowserChannel<
  SignRawPopupInput,
  SignRawPopupOutput
>('signRaw');

export function initContentSignRawChannel(origin: string): () => void {
  return injectedSignRawChannel.produce(async (input) => {
    await contentAccessChannel.get(input);
    return contentSignRawChannel.get({ ...input, origin });
  });
}
