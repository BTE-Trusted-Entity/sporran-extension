import { browser } from 'webextension-polyfill-ts';
import { createOnMessage } from '../createOnMessage/createOnMessage';

const toggleIconRequest = 'toggleIconsRequest';

type ToggleIconRequest = Record<string, never>;

export function toggleIcon(): void {
  if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return;
  }
  browser.runtime.sendMessage({
    type: toggleIconRequest,
  });
}

export const onToggleIconRequest =
  createOnMessage<ToggleIconRequest>(toggleIconRequest);

export async function toggleIconListener(): Promise<void> {
  browser.browserAction.setIcon({
    path: {
      16: 'icon/dark/16.png',
      32: 'icon/dark/32.png',
      48: 'icon/dark/48.png',
      128: 'icon/dark/128.png',
    },
  });
}
