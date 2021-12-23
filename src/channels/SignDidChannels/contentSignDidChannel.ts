import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

import { injectedSignDidChannel } from './injectedSignDidChannel';
import { SignDidPopupInput, SignDidPopupOutput } from './types';

export const contentSignDidChannel = new BrowserChannel<
  SignDidPopupInput,
  SignDidPopupOutput
>('signDid');

export function initContentSignDidChannel(origin: string): () => void {
  return injectedSignDidChannel.produce(async ({ plaintext }) =>
    contentSignDidChannel.get({ plaintext, origin }),
  );
}
