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
  console.log('setting dark mode icon');
  browser.browserAction.setIcon({
    path: 'icon-dark-mode-16.png',
  });
}
