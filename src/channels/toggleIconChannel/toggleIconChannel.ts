import browser from 'webextension-polyfill';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';

export const toggleIconChannel = new BrowserChannel(channelsEnum.toggleIcons);

export async function toggleIcon(): Promise<void> {
  if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return;
  }
  await toggleIconChannel.get();
}

export async function produceToggleIcon(): Promise<void> {
  await browser.action.setIcon({
    path: {
      16: 'icon/dark/16.png',
      32: 'icon/dark/32.png',
      48: 'icon/dark/48.png',
      128: 'icon/dark/128.png',
    },
  });
}
