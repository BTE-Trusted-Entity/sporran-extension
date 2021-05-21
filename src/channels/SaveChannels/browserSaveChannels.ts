import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { injectedSaveChannel } from './injectedSaveChannel';
import { SaveInput, SaveOutput } from './types';

export const contentSaveChannel = new BrowserChannel<SaveInput, SaveOutput>(
  'save',
);

export const backgroundSaveChannel = new PopupChannel<SaveInput, SaveOutput>(
  'save',
);

export function initContentSaveChannel(): void {
  injectedSaveChannel.forward(contentSaveChannel);
}

export function initBackgroundSaveChannel(): void {
  contentSaveChannel.forward(backgroundSaveChannel);
}
