import { browser } from 'webextension-polyfill-ts';
import { toggleIcon } from './channels/toggleIconChannel/toggleIconChannel';
import { initContentClaimChannel } from './channels/ClaimChannels/browserClaimChannels';
import { initContentSaveChannel } from './channels/SaveChannels/browserSaveChannels';
import { initContentShareChannel } from './channels/ShareChannels/browserShareChannels';
import { initContentAccountsChannel } from './dApps/accountsDataProvider/accountsDataProvider';
import { initContentAccessChannel } from './dApps/checkAccess/checkAccess';
import { initContentSignChannel } from './dApps/SignChannels/contentSignChannel';

function injectScript() {
  // content scripts cannot expose APIs to website code, only injected scripts can
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.src = browser.runtime.getURL('js/injectedScript.js');
  document.head.appendChild(script);
}

function initMessages() {
  initContentClaimChannel();
  initContentSaveChannel();
  initContentShareChannel();

  const origin = window.location.href;
  initContentAccessChannel(origin);
  initContentAccountsChannel(origin);
  initContentSignChannel(origin);
}

function main() {
  injectScript();
  initMessages();
  toggleIcon();
}

main();
