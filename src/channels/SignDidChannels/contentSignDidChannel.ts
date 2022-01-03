import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { injectedSignDidChannel } from './injectedSignDidChannel';
import { SignDidInput, SignDidOutput } from './types';

export const contentSignDidChannel = new BrowserChannel<
  SignDidInput,
  SignDidOutput
>(popupsEnum.signDid);

export function initContentSignDidChannel(): () => void {
  return injectedSignDidChannel.forward(contentSignDidChannel);
}
