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
import { handleAllAccountsRequests } from './dApps/accountsDataProvider/accountsDataProvider';
import { handleAllAccessRequests } from './dApps/checkAccess/checkAccess';
import { handleAllSignRequests } from './dApps/signaturesProvider/signaturesProvider';

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

  const origin = window.location.href;
  handleAllAccessRequests(origin);
  handleAllAccountsRequests(origin);
  handleAllSignRequests(origin);
}

function main() {
  injectScript();
  initMessages();
  toggleIcon();
}

main();
