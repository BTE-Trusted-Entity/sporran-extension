import { browser } from 'webextension-polyfill-ts';
import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

export const toggleIconChannel = new BrowserChannel('toggleIcons');

export async function toggleIcon(): Promise<void> {
  if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return;
  }
  await toggleIconChannel.get();
}

export async function produceToggleIcon(): Promise<void> {
  await browser.browserAction.setIcon({
    path: {
      16: 'icon/dark/16.png',
      32: 'icon/dark/32.png',
      48: 'icon/dark/48.png',
      128: 'icon/dark/128.png',
    },
  });
}

export function initBackgroundToggleIconChannel(): void {
  toggleIconChannel.produce(produceToggleIcon);
}
