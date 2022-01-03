import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { injectedSignRawChannel } from './injectedSignRawChannel';
import { SignRawInput, SignRawOutput } from './types';

export const contentSignRawChannel = new BrowserChannel<
  SignRawInput,
  SignRawOutput
>(popupsEnum.signRaw);

export function initContentSignRawChannel(): () => void {
  return injectedSignRawChannel.forward(contentSignRawChannel);
}
