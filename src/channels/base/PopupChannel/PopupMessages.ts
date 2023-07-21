import type { AnyJson } from '@polkadot/types/types';

import browser, { Runtime, Windows } from 'webextension-polyfill';

import { PopupAction } from '../../../utilities/popups/types';
import { jsonToBase64 } from '../../../utilities/base64/base64';
import { isExtensionPopup } from '../../../utilities/isExtensionPopup/isExtensionPopup';

// TODO: move everything into PopupChannel or rename?

function getPopupUrl(
  values: AnyJson,
  action: PopupAction,
  callId: string,
): string {
  const url = new URL(browser.runtime.getURL('popup.html'));

  url.searchParams.set('data', jsonToBase64(values));
  url.searchParams.set('action', action);
  url.searchParams.set('callId', callId);

  return url.toString();
}

const type = 'popup';
const width = 480;
const height = 600;

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

export async function resizePopup(): Promise<void> {
  const currentWindow = await browser.windows.getCurrent();
  const { id } = currentWindow;
  if (!id || isExtensionPopup()) {
    return;
  }

  const cssPxWidth = window.outerWidth;
  const cssPxHeight = window.outerHeight;

  const cssPxDiffWidth = width - window.innerWidth;
  const cssPxDiffHeight = height - window.innerHeight;
  if (cssPxDiffWidth <= 0 && cssPxDiffHeight <= 0) {
    return;
  }

  const zoom = await browser.tabs.getZoom();
  const osPxDiffWidth = Math.ceil(cssPxDiffWidth * zoom);
  const osPxDiffHeight = Math.ceil(cssPxDiffHeight * zoom);

  const osPxWidth = currentWindow.width || cssPxWidth;
  const osPxHeight = currentWindow.height || cssPxHeight;

  await browser.windows.update(id, {
    width: osPxWidth + osPxDiffWidth,
    height: osPxHeight + osPxDiffHeight,
  });
}

export async function showPopup(
  action: PopupAction,
  input: AnyJson,
  callId: string,
  sender: Runtime.MessageSender,
): Promise<Windows.Window> {
  tabId = sender.tab?.id;

  await closeExistingPopup();

  // scripts cannot show the extension popup itself, only create window popups
  const url = getPopupUrl(input, action, callId);

  const windowId = sender.tab?.windowId;

  const realWindow = windowId && (await browser.windows.get(windowId));
  const fakeWindow = { left: 0, top: 0, width: 1400, height: 800 };

  const sizes =
    realWindow && realWindow.left !== undefined
      ? (realWindow as typeof fakeWindow)
      : fakeWindow;

  const left = sizes.left + sizes.width - width - 50;
  const top = sizes.top + 80;

  const window = await browser.windows.create({
    url,
    type,
    width,
    height,
    left,
    top,
  });
  popupId = window.id;

  return window;
}

export function popupTabRemovedListener(
  removedTabId: number,
): Promise<void> | void {
  if (tabId !== removedTabId) {
    return;
  }
  return (async () => {
    await closeExistingPopup();
  })();
}
