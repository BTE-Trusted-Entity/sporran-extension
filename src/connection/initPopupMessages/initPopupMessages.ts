import { browser } from 'webextension-polyfill-ts';

import { MessageType, PopupRequest } from '../MessageType';

function getPopupUrl(values: { [key: string]: string }): string {
  const url = new URL(browser.runtime.getURL('popup.html'));

  Object.keys(values).forEach((key) => {
    url.searchParams.append(key, values[key]);
  });

  return url.toString();
}

const type = 'popup';
const width = 480 + 1; // +1 to compensate for the window chrome
const height = 600 + 1;

function popupListener(message: PopupRequest) {
  if (message.type !== MessageType.popupRequest) {
    return;
  }

  return (async () => {
    // scripts cannot show the extension popup itself, only create window popups
    const url = getPopupUrl(message.data);
    await browser.windows.create({ url, type, width, height });
  })();
}

export function initPopupMessages(): void {
  browser.runtime.onMessage.addListener(popupListener);
}
