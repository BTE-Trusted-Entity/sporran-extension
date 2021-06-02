import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { injectedShareChannel } from './injectedShareChannel';
import { ShareInput, ShareOutput } from './types';

export const contentShareChannel = new BrowserChannel<ShareInput, ShareOutput>(
  'share',
);

export const backgroundShareChannel = new PopupChannel<ShareInput, ShareOutput>(
  'share',
);

export function initContentShareChannel(): void {
  injectedShareChannel.forward(contentShareChannel);
}

export function initBackgroundShareChannel(): void {
  contentShareChannel.forward(backgroundShareChannel);
}
