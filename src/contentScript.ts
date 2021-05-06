import { browser } from 'webextension-polyfill-ts';
import {
  PopupMessageType,
  PopupResponse,
  sendPopupRequest,
} from './connection/PopupMessages/PopupMessages';
import {
  onPopupWindowRequest,
  sendPopupWindowResponse,
} from './connection/PopupWindowMessages/PopupWindowMessages';

function injectScript() {
  // content scripts cannot expose APIs to website code, only injected scripts can
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.src = browser.runtime.getURL('js/injectedScript.js');
  document.head.appendChild(script);
}

function popupResponseListener(message: PopupResponse) {
  if (message.type !== PopupMessageType.popupResponse) {
    return;
  }

  sendPopupWindowResponse(message.data);
}

function initMessages() {
  onPopupWindowRequest(sendPopupRequest);
  browser.runtime.onMessage.addListener(popupResponseListener);
}

function main() {
  injectScript();
  initMessages();
}

main();
