import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

import { injectedSignChannel } from './injectedSignChannel';
import { SignPopupInput, SignPopupOutput } from './types';

export const contentSignChannel = new BrowserChannel<
  Omit<SignPopupInput, 'origin'>,
  SignPopupOutput
>('sign');

export function initContentSignChannel(): () => void {
  return injectedSignChannel.forward(contentSignChannel);
}
