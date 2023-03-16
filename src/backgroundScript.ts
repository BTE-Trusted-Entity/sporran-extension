import browser from 'webextension-polyfill';

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
import { produceEncryptedChallenge } from './channels/ChallengeChannels/backgroundChallengeChannel';
import { showCredentialPopup } from './channels/CredentialChannels/backgroundCredentialChannel';
import { getSignDidResult } from './channels/SignDidChannels/backgroundSignDidChannel';
import { contentAccessChannel } from './channels/AccessChannels/contentAccessChannel';
import { getAuthorizedOrigin } from './channels/AccessChannels/getAuthorizedOrigin';
import { contentCredentialChannel } from './channels/CredentialChannels/contentCredentialChannel';
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
  contentSignDidChannel.produce(getSignDidResult);
  contentSignDidExtrinsicChannel.produce(getSignDidExtrinsicResult);
  contentCreateDidChannel.produce(getCreateDidResult);
  contentChallengeChannel.produce(produceEncryptedChallenge);
  contentShareIdentitiesChannel.produce(getGetDidList);
  browser.tabs.onRemoved.addListener(popupTabRemovedListener);

  onPopupConnect(connectToBlockchain);
  toggleIconChannel.produce(produceToggleIcon);
}

init();
