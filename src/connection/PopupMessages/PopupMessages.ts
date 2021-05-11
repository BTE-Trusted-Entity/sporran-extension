import { browser } from 'webextension-polyfill-ts';

import { PopupAction } from '../../utilities/popups/types';
import { createOnMessage } from '../createOnMessage/createOnMessage';

const popupRequest = 'popupRequest';
const popupResponse = 'popupResponse';

interface PopupRequest {
  action: PopupAction;
  [key: string]: string;
}

interface PopupResponse {
  [key: string]: string;
}

export async function sendPopupRequest(
  action: PopupAction,
  values: PopupResponse,
): Promise<void> {
  const windowWidth = window.innerWidth.toString();
  const windowHeight = window.innerHeight.toString();
  const outerWindowHeight = window.outerHeight.toString();
  const screenLeft = window.screenLeft.toString();
  const screenTop = window.screenTop.toString();

  console.log('Window height: ', windowHeight);
  console.log('Screen top: ', screenTop);

  await browser.runtime.sendMessage({
    type: popupRequest,
    data: {
      action,
      windowWidth,
      windowHeight,
      outerWindowHeight,
      screenLeft,
      screenTop,
      ...values,
    } as PopupRequest,
  });
}

export async function sendPopupResponse(data: {
  [key: string]: string;
}): Promise<void> {
  await browser.runtime.sendMessage({
    type: popupResponse,
    data: data as PopupResponse,
  });
}

async function sendPopupTabResponse(
  tabId: number,
  data: {
    [key: string]: string;
  },
): Promise<void> {
  await browser.tabs.sendMessage(tabId, {
    type: popupResponse,
    data: data as PopupResponse,
  });
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

export const onPopupRequest = createOnMessage<PopupRequest>(popupRequest);

export const onPopupResponse = createOnMessage<PopupResponse>(popupResponse);

export async function popupRequestListener(
  data: PopupRequest,
  sender: { tab?: { id?: number } },
): Promise<void> {
  tabId = sender?.tab?.id;

  await closeExistingPopup();

  // scripts cannot show the extension popup itself, only create window popups
  const {
    action,
    values,
    windowWidth,
    windowHeight,
    outerWindowHeight,
    screenLeft,
    screenTop,
  } = data;
  const url = getPopupUrl({ action, values });

  const left = +screenLeft + +windowWidth - width - 50;
  const top = +screenTop + +outerWindowHeight - +windowHeight;

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

export async function popupResponseListener(
  data: PopupResponse,
): Promise<void> {
  if (!tabId) {
    return;
  }
  await sendPopupTabResponse(tabId, data);
  tabId = undefined;
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
