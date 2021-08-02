import { browser } from 'webextension-polyfill-ts';
import { PopupAction } from '../../../utilities/popups/types';

// TODO: move everything into PopupChannel or rename?

interface Serializable {
  toString: () => string;
}

function getPopupUrl(
  values: Record<string, Serializable>,
  action: PopupAction,
): string {
  const url = new URL(browser.runtime.getURL('popup.html'));

  url.searchParams.set('data', window.btoa(JSON.stringify(values)));
  url.searchParams.set('action', action);

  return url.toString();
}

const type = 'popup';
const width = 480 + 1; // +1 to compensate for the window chrome
const height = 600 + 23; // +23 to compensate for the window

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

export async function showPopup(
  action: PopupAction,
  input: Record<string, Serializable>,
  sender: { tab?: { id?: number; windowId?: number } },
): Promise<void> {
  tabId = sender.tab?.id;

  await closeExistingPopup();

  // scripts cannot show the extension popup itself, only create window popups
  const url = getPopupUrl(input, action);

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
