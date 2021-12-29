import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

import { injectedSignDidChannel } from './injectedSignDidChannel';
import { SignDidPopupInput, SignDidPopupOutput } from './types';

export const contentSignDidChannel = new BrowserChannel<
  Omit<SignDidPopupInput, 'origin'>,
  SignDidPopupOutput
>('signDid');

export function initContentSignDidChannel(): () => void {
  return injectedSignDidChannel.forward(contentSignDidChannel);
}
