import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

import { injectedSignChannel } from './injectedSignChannel';
import { SignPopupInput, SignPopupOutput } from './types';

export const contentSignChannel = new BrowserChannel<
  SignPopupInput,
  SignPopupOutput
>('sign');

export function initContentSignChannel(origin: string): () => void {
  return injectedSignChannel.produce(async (input) =>
    contentSignChannel.get({ ...input, origin }),
  );
}
