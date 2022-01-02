import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

import { injectedSignChannel } from './injectedSignChannel';
import { SignInput, SignOutput } from './types';

export const contentSignChannel = new BrowserChannel<
  Omit<SignInput, 'origin'>,
  SignOutput
>('sign');

export function initContentSignChannel(): () => void {
  return injectedSignChannel.forward(contentSignChannel);
}
