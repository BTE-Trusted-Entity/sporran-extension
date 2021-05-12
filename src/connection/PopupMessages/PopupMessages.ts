import { browser } from 'webextension-polyfill-ts';

import { PopupAction } from '../../utilities/popups/types';
import { createOnMessage } from '../createOnMessage/createOnMessage';

const popupRequest = 'popupRequest';
const popupResponse = 'popupResponse';

interface Window {
  innerWidth: number;
  innerHeight: number;
  outerHeight: number;
  screenLeft: number;
  screenTop: number;
}

interface PopupResponse {
  [key: string]: string;
}

interface PopupRequest {
  action: PopupAction;
  windowProps: Window;
  values: PopupResponse;
}

export async function sendPopupRequest(
  action: PopupAction,
  values: PopupResponse,
): Promise<void> {
  const windowProps = {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerHeight: window.outerHeight,
    screenLeft: window.screenLeft,
    screenTop: window.screenTop,
  };

  await browser.runtime.sendMessage({
    type: popupRequest,
    data: {
      action,
      windowProps,
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
  const { action, values, windowProps } = data;
  const url = getPopupUrl({ action, ...values });

  const { innerWidth, innerHeight, outerHeight, screenLeft, screenTop } =
    windowProps;

  const left = screenLeft + innerWidth - width - 50;
  const top = screenTop + outerHeight - innerHeight;

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
