import { browser } from 'webextension-polyfill-ts';

import { getIdentities } from './utilities/identities/getIdentities';
import { toggleIcon } from './channels/toggleIconChannel/toggleIconChannel';
import { contentAccessChannel } from './channels/AccessChannels/contentAccessChannel';
import { contentCredentialChannel } from './channels/CredentialChannels/contentCredentialChannel';
import { contentChallengeChannel } from './channels/ChallengeChannels/contentChallengeChannel';
import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import { injectedChallengeChannel } from './channels/ChallengeChannels/injectedChallengeChannel';
import { injectedAccessChannel } from './channels/AccessChannels/injectedAccessChannel';
import { contentCreateDidChannel } from './channels/CreateDidChannels/contentCreateDidChannel';
import { injectedCreateDidChannel } from './channels/CreateDidChannels/injectedCreateDidChannel';

function injectScript() {
  // content scripts cannot expose APIs to website code, only injected scripts can
  const script = document.createElement('script');
  script.type = 'module';
  script.async = true;
  script.src = browser.runtime.getURL('js/injectedScript.js');
  document.head.appendChild(script);
}

function initMessages() {
  injectedCredentialChannel.forward(contentCredentialChannel);
  injectedChallengeChannel.forward(contentChallengeChannel);
  injectedAccessChannel.forward(contentAccessChannel);
  injectedCreateDidChannel.forward(contentCreateDidChannel);
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
