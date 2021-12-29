import { browser } from 'webextension-polyfill-ts';

import { initKiltSDK } from './utilities/initKiltSDK/initKiltSDK';
import { initBackgroundToggleIconChannel } from './channels/toggleIconChannel/toggleIconChannel';
import {
  initBackgroundForgetAllPasswordsChannel,
  initBackgroundForgetPasswordChannel,
  initBackgroundGetPasswordChannel,
  initBackgroundHasSavedPasswordsChannel,
  initBackgroundSavePasswordChannel,
  schedulePasswordsCheck,
} from './channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { popupTabRemovedListener } from './channels/base/PopupChannel/PopupMessages';
import {
  connectToBlockchain,
  onPopupConnect,
} from './channels/ExtensionPopupMessages/ExtensionPopupMessages';
import { initBackgroundSignChannel } from './dApps/SignChannels/backgroundSignChannel';
import { initBackgroundSignRawChannel } from './dApps/SignRawChannels/backgroundSignRawChannel';
import { backgroundChallengeChannel } from './channels/ChallengeChannels/backgroundChallengeChannel';
import { initBackgroundAccessChannel } from './dApps/AccessChannels/backgroundAccessChannels';
import { initBackgroundGenesisHashChannel } from './dApps/genesisHashChannel/initBackgroundGenesisHashChannel';
import { initBackgroundCredentialChannel } from './channels/CredentialChannels/backgroundCredentialChannel';
import { initBackgroundSignDidChannel } from './channels/SignDidChannels/backgroundSignDidChannel';

function initSavedPasswords() {
  schedulePasswordsCheck();
  initBackgroundSavePasswordChannel();
  initBackgroundGetPasswordChannel();
  initBackgroundForgetPasswordChannel();
  initBackgroundForgetAllPasswordsChannel();
  initBackgroundHasSavedPasswordsChannel();
}

function initDAppChannels() {
  initBackgroundAccessChannel();
  initBackgroundCredentialChannel();
  initBackgroundSignChannel();
  initBackgroundSignRawChannel();
  backgroundChallengeChannel();
  browser.tabs.onRemoved.addListener(popupTabRemovedListener);
}

function initExtensionPopupMessages() {
  onPopupConnect(connectToBlockchain);
}

function init() {
  initKiltSDK();
  initExtensionPopupMessages();
  initBackgroundToggleIconChannel();
  initSavedPasswords();
  initDAppChannels();
  initBackgroundGenesisHashChannel();
  initBackgroundSignDidChannel();
}

init();
