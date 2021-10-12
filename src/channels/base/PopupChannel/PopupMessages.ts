import { browser, Windows } from 'webextension-polyfill-ts';
import type { AnyJson } from '@polkadot/types/types';

import { PopupAction } from '../../../utilities/popups/types';
import { jsonToBase64 } from '../../../utilities/popups/usePopupData';
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
  const { id } = await browser.windows.getCurrent();
  if (!id || isExtensionPopup()) {
    return;
  }

  const { innerWidth, innerHeight, outerWidth, outerHeight } = window;

  const diffWidth = width - innerWidth;
  const diffHeight = height - innerHeight;
  if (diffWidth <= 0 && diffHeight <= 0) {
    return;
  }

  await browser.windows.update(id, {
    width: outerWidth + diffWidth,
    height: outerHeight + diffHeight,
  });
}

export async function showPopup(
  action: PopupAction,
  input: AnyJson,
  callId: string,
  sender: { tab?: { id?: number; windowId?: number } },
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
