import { browser } from 'webextension-polyfill-ts';
import {
  PopupMessageType,
  PopupResponse,
  sendPopupRequest,
} from './connection/PopupMessages/PopupMessages';

function injectScript() {
  // content scripts cannot expose APIs to website code, only injected scripts can
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.src = browser.runtime.getURL('js/injectedScript.js');
  document.head.appendChild(script);
}

function messageListener(message: MessageEvent) {
  const { data, source } = message;
  const { type, action, ...values } = data;

  if (source !== window || type !== 'sporranExtension.injectedScript.request') {
    return;
  }

  (async () => {
    // content scripts cannot open windows, only background and popup scripts can
    await sendPopupRequest(action, values);
  })();
}

function popupResponseListener(message: PopupResponse) {
  if (message.type !== PopupMessageType.popupResponse) {
    return;
  }

  window.postMessage(
    {
      type: 'sporranExtension.injectedScript.response',
      ...message.data,
    },
    window.location.href,
  );
}

function initMessages() {
  window.addEventListener('message', messageListener);
  browser.runtime.onMessage.addListener(popupResponseListener);
}

function main() {
  injectScript();
  initMessages();
}

main();
