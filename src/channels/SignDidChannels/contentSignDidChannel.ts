import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

import { injectedSignDidChannel } from './injectedSignDidChannel';
import { SignDidInput, SignDidOutput } from './types';

export const contentSignDidChannel = new BrowserChannel<
  SignDidInput,
  SignDidOutput
>('signDid');

export function initContentSignDidChannel(): () => void {
  return injectedSignDidChannel.forward(contentSignDidChannel);
}
