import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

import { injectedSignDidChannel } from './injectedSignDidChannel';
import { SignDidInput, SignDidOutput } from './types';

export const contentSignDidChannel = new BrowserChannel<
  Omit<SignDidInput, 'origin'>,
  SignDidOutput
>('signDid');

export function initContentSignDidChannel(): () => void {
  return injectedSignDidChannel.forward(contentSignDidChannel);
}
