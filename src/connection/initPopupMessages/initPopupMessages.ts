import { browser } from 'webextension-polyfill-ts';

import { MessageType, PopupRequest, PopupResponse } from '../MessageType';

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

let popupId: number | undefined;
let tabId: number | undefined;

async function closeExistingPopup() {
  if (popupId === undefined) {
    return;
  }
  try {
    await browser.windows.remove(popupId);
  } catch {
    // ignore the error, can’t do anything here
  }
  popupId = undefined;
}

function popupListener(
  message: PopupRequest,
  sender: { tab?: { id?: number } },
) {
  if (message.type !== MessageType.popupRequest) {
    return;
  }

  tabId = sender?.tab?.id;

  return (async () => {
    await closeExistingPopup();

    // scripts cannot show the extension popup itself, only create window popups
    const url = getPopupUrl(message.data);
    const window = await browser.windows.create({ url, type, width, height });
    popupId = window.id;
  })();
}

function responseListener(message: PopupResponse) {
  if (message.type !== MessageType.popupResponse) {
    return;
  }

  (async () => {
    if (!tabId) {
      return;
    }
    await browser.tabs.sendMessage(tabId, {
      type: MessageType.popupResponse,
      data: message.data,
    });
    tabId = undefined;
  })();
}

function tabRemovedListener(removedTabId: number) {
  if (tabId !== removedTabId) {
    return;
  }
  (async () => {
    await closeExistingPopup();
  })();
}

export function initPopupMessages(): void {
  browser.runtime.onMessage.addListener(popupListener);
  browser.runtime.onMessage.addListener(responseListener);
  browser.tabs.onRemoved.addListener(tabRemovedListener);
}
