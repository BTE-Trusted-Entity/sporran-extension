import { browser } from 'webextension-polyfill-ts';
import { getIdentities } from './utilities/identities/getIdentities';
import { toggleIcon } from './channels/toggleIconChannel/toggleIconChannel';
import { initContentIdentitiesChannel } from './dApps/identitiesDataProvider/identitiesDataProvider';
import { initContentAccessChannel } from './dApps/checkAccess/checkAccess';
import { initContentSignChannel } from './dApps/SignChannels/contentSignChannel';
import { initContentCredentialChannel } from './channels/CredentialChannels/contentCredentialChannel';
import { initContentChallengeChannel } from './channels/ChallengeChannels/contentChallengeChannel';

function injectScript() {
  // content scripts cannot expose APIs to website code, only injected scripts can
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.src = browser.runtime.getURL('js/injectedScript.js');
  document.head.appendChild(script);
}

function initMessages() {
  initContentCredentialChannel();
  initContentChallengeChannel();

  const origin = new URL(window.location.href).host;
  initContentAccessChannel(origin);
  initContentIdentitiesChannel(origin);
  initContentSignChannel(origin);
}

async function main() {
  const identities = await getIdentities();
  if (Object.keys(identities).length > 0) {
    injectScript();
    initMessages();
  }
  await toggleIcon();
}

main();
