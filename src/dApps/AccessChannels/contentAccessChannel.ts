import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

import { injectedAccessChannel } from './injectedAccessChannel';
import { AccessInput, AccessOutput } from './types';

export const contentAccessChannel = new BrowserChannel<
  AccessInput,
  AccessOutput
>('access');

export function initContentAccessChannel(): void {
  injectedAccessChannel.forward(contentAccessChannel);
}
