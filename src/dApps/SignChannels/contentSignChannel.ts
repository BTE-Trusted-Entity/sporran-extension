import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { contentAccessChannel } from '../AccessChannels/contentAccessChannel';

import { injectedSignChannel } from './injectedSignChannel';
import { SignPopupInput, SignPopupOutput } from './types';

export const contentSignChannel = new BrowserChannel<
  SignPopupInput,
  SignPopupOutput
>('sign');

export function initContentSignChannel(origin: string): () => void {
  return injectedSignChannel.produce(async (input) => {
    await contentAccessChannel.get({ dAppName: input.dAppName, origin });
    return contentSignChannel.get({ ...input, origin });
  });
}
