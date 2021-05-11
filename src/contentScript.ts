import { browser } from 'webextension-polyfill-ts';
import { toggleIcon } from './connection/IconMessages/IconMessages';
import {
  onPopupResponse,
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

async function popupResponseListener(
  data: Parameters<typeof sendPopupWindowResponse>[0],
) {
  sendPopupWindowResponse(data);
}

function initMessages() {
  onPopupWindowRequest(sendPopupRequest);
  onPopupResponse(popupResponseListener);
}

function main() {
  injectScript();
  initMessages();
  toggleIcon();
}

main();
