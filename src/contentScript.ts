import { browser } from 'webextension-polyfill-ts';
import { MessageType, PopupRequest } from './connection/MessageType';

function injectScript() {
  // content scripts cannot expose APIs to website code, only injected scripts can
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.src = browser.runtime.getURL('js/injectedScript.js');
  document.head.appendChild(script);
}

function messageListener(event: MessageEvent) {
  const { data, source } = event;
  const { type, action, ...values } = data;

  if (source !== window || type !== 'sporranExtension.injectedScript') {
    return;
  }

  (async () => {
    // content scripts cannot open windows, only background and popup scripts can
    await browser.runtime.sendMessage({
      type: MessageType.popupRequest,
      data: { action, ...values },
    } as PopupRequest);
  })();
}

function initMessages() {
  window.addEventListener('message', messageListener);
}

function main() {
  injectScript();
  initMessages();
}

main();
