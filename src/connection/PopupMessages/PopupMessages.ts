import { browser } from 'webextension-polyfill-ts';

import { PopupAction } from '../../utilities/popups/types';

export const PopupMessageType = {
  popupRequest: 'popupRequest',
  popupResponse: 'popupResponse',
};

export interface PopupRequest {
  type: typeof PopupMessageType.popupRequest;
  data: {
    action: PopupAction;
    [key: string]: string;
  };
}

export interface PopupResponse {
  type: typeof PopupMessageType.popupResponse;
  data: {
    [key: string]: string;
  };
}

export async function sendPopupRequest(
  action: PopupAction,
  values: PopupResponse['data'],
): Promise<void> {
  await browser.runtime.sendMessage({
    type: PopupMessageType.popupRequest,
    data: { action, ...values },
  } as PopupRequest);
}

export async function sendPopupResponse(data: {
  [key: string]: string;
}): Promise<void> {
  await browser.runtime.sendMessage({
    type: PopupMessageType.popupResponse,
    data,
  } as PopupResponse);
}

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

export function popupRequestListener(
  message: PopupRequest,
  sender: { tab?: { id?: number } },
): Promise<void> | void {
  if (message.type !== PopupMessageType.popupRequest) {
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

export function popupResponseListener(
  message: PopupResponse,
): Promise<void> | void {
  if (message.type !== PopupMessageType.popupResponse) {
    return;
  }

  (async () => {
    if (!tabId) {
      return;
    }
    await browser.tabs.sendMessage(tabId, {
      type: PopupMessageType.popupResponse,
      data: message.data,
    });
    tabId = undefined;
  })();
}

export function popupTabRemovedListener(
  removedTabId: number,
): Promise<void> | void {
  if (tabId !== removedTabId) {
    return;
  }
  (async () => {
    await closeExistingPopup();
  })();
}
