import browser from 'webextension-polyfill';

import { getIdentities } from './utilities/identities/getIdentities';
import { toggleIcon } from './channels/toggleIconChannel/toggleIconChannel';
import { injectedIdentitiesSubscriber } from './dApps/identitiesDataProvider/identitiesDataProvider';
import { contentAccessChannel } from './dApps/AccessChannels/contentAccessChannel';
import { contentSignChannel } from './dApps/SignChannels/contentSignChannel';
import { contentSignRawChannel } from './dApps/SignRawChannels/contentSignRawChannel';
import { contentSignDidChannel } from './channels/SignDidChannels/contentSignDidChannel';
import { contentCredentialChannel } from './channels/CredentialChannels/contentCredentialChannel';
import { contentChallengeChannel } from './channels/ChallengeChannels/contentChallengeChannel';
import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import { injectedChallengeChannel } from './channels/ChallengeChannels/injectedChallengeChannel';
import { injectedAccessChannel } from './dApps/AccessChannels/injectedAccessChannel';
import { injectedSignChannel } from './dApps/SignChannels/injectedSignChannel';
import { injectedSignRawChannel } from './dApps/SignRawChannels/injectedSignRawChannel';
import { injectedSignDidChannel } from './channels/SignDidChannels/injectedSignDidChannel';
import { injectedIdentitiesChannel } from './dApps/injectedIdentitiesChannel/injectedIdentitiesChannel';
import { injectedSignDidExtrinsicChannel } from './channels/SignDidExtrinsicChannels/injectedSignDidExtrinsicChannel';
import { contentSignDidExtrinsicChannel } from './channels/SignDidExtrinsicChannels/contentSignDidExtrinsicChannel';
import { contentCreateDidChannel } from './channels/CreateDidChannels/contentCreateDidChannel';
import { injectedCreateDidChannel } from './channels/CreateDidChannels/injectedCreateDidChannel';
import { injectedShareIdentitiesChannel } from './channels/ShareIdentitiesChannels/injectedShareIdentitiesChannel';
import { contentShareIdentitiesChannel } from './channels/ShareIdentitiesChannels/contentShareIdentitiesChannel';

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
  injectedIdentitiesChannel.publish(injectedIdentitiesSubscriber);
  injectedSignChannel.forward(contentSignChannel);
  injectedSignRawChannel.forward(contentSignRawChannel);
  injectedSignDidChannel.forward(contentSignDidChannel);
  injectedSignDidExtrinsicChannel.forward(contentSignDidExtrinsicChannel);
  injectedCreateDidChannel.forward(contentCreateDidChannel);
  injectedShareIdentitiesChannel.forward(contentShareIdentitiesChannel);
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
