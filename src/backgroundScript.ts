import { browser } from 'webextension-polyfill-ts';

import { initKiltSDK } from './utilities/initKiltSDK/initKiltSDK';
import {
  produceToggleIcon,
  toggleIconChannel,
} from './channels/toggleIconChannel/toggleIconChannel';
import {
  forgetAllPasswords,
  forgetAllPasswordsChannel,
  forgetPassword,
  forgetPasswordChannel,
  getPassword,
  getPasswordChannel,
  hasSavedPasswords,
  hasSavedPasswordsChannel,
  savePassword,
  savePasswordChannel,
  schedulePasswordsCheck,
} from './channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { popupTabRemovedListener } from './channels/base/PopupChannel/PopupMessages';
import {
  connectToBlockchain,
  onPopupConnect,
} from './channels/ExtensionPopupMessages/ExtensionPopupMessages';
import { getSignResult } from './dApps/SignChannels/backgroundSignChannel';
import { getSignRawResult } from './dApps/SignRawChannels/backgroundSignRawChannel';
import { produceEncryptedChallenge } from './channels/ChallengeChannels/backgroundChallengeChannel';
import { getGenesisHash } from './dApps/genesisHashChannel/initBackgroundGenesisHashChannel';
import { showCredentialPopup } from './channels/CredentialChannels/backgroundCredentialChannel';
import { getSignDidResult } from './channels/SignDidChannels/backgroundSignDidChannel';
import { contentAccessChannel } from './dApps/AccessChannels/contentAccessChannel';
import { getAuthorizedOrigin } from './dApps/AccessChannels/getAuthorizedOrigin';
import { genesisHashChannel } from './dApps/genesisHashChannel/genesisHashChannel';
import { contentCredentialChannel } from './channels/CredentialChannels/contentCredentialChannel';
import { contentSignChannel } from './dApps/SignChannels/contentSignChannel';
import { contentSignRawChannel } from './dApps/SignRawChannels/contentSignRawChannel';
import { contentSignDidChannel } from './channels/SignDidChannels/contentSignDidChannel';
import { contentChallengeChannel } from './channels/ChallengeChannels/contentChallengeChannel';
import { contentSignDidExtrinsicChannel } from './channels/SignDidExtrinsicChannels/contentSignDidExtrinsicChannel';
import { getSignDidExtrinsicResult } from './channels/SignDidExtrinsicChannels/backgroundSignDidExtrinsicChannel';
import { getCreateDidResult } from './channels/CreateDidChannels/backgroundCreateDidChannel';
import { contentCreateDidChannel } from './channels/CreateDidChannels/contentCreateDidChannel';
import { contentShareIdentitiesChannel } from './channels/ShareIdentitiesChannels/contentShareIdentitiesChannel';
import { getGetDidList } from './channels/ShareIdentitiesChannels/backgroundShareIdentitiesChannel';

function init() {
  initKiltSDK();

  schedulePasswordsCheck();
  savePasswordChannel.produce(savePassword);
  getPasswordChannel.produce(getPassword);
  forgetPasswordChannel.produce(forgetPassword);
  forgetAllPasswordsChannel.produce(forgetAllPasswords);
  hasSavedPasswordsChannel.produce(hasSavedPasswords);

  contentAccessChannel.produce(getAuthorizedOrigin);
  contentCredentialChannel.produce(showCredentialPopup);
  contentSignChannel.produce(getSignResult);
  contentSignRawChannel.produce(getSignRawResult);
  contentSignDidChannel.produce(getSignDidResult);
  contentSignDidExtrinsicChannel.produce(getSignDidExtrinsicResult);
  contentCreateDidChannel.produce(getCreateDidResult);
  contentChallengeChannel.produce(produceEncryptedChallenge);
  contentShareIdentitiesChannel.produce(getGetDidList);
  browser.tabs.onRemoved.addListener(popupTabRemovedListener);

  onPopupConnect(connectToBlockchain);
  toggleIconChannel.produce(produceToggleIcon);
  genesisHashChannel.produce(getGenesisHash);
}

init();
