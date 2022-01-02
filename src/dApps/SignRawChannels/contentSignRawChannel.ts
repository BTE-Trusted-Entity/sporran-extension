import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

import { injectedSignRawChannel } from './injectedSignRawChannel';
import { SignRawInput, SignRawOutput } from './types';

export const contentSignRawChannel = new BrowserChannel<
  SignRawInput,
  SignRawOutput
>('signRaw');

export function initContentSignRawChannel(): () => void {
  return injectedSignRawChannel.forward(contentSignRawChannel);
}
