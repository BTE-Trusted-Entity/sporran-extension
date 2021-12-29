import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

import { injectedSignRawChannel } from './injectedSignRawChannel';
import { SignRawPopupInput, SignRawPopupOutput } from './types';

export const contentSignRawChannel = new BrowserChannel<
  Omit<SignRawPopupInput, 'origin'>,
  SignRawPopupOutput
>('signRaw');

export function initContentSignRawChannel(): () => void {
  return injectedSignRawChannel.forward(contentSignRawChannel);
}
