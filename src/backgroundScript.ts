import { browser } from 'webextension-polyfill-ts';

import { initKiltSDK } from './channels/initKiltSDK/initKiltSDK';
import { initBackgroundToggleIconChannel } from './channels/toggleIconChannel/toggleIconChannel';
import {
  initBackgroundSignTransferChannel,
  initBackgroundSubmitTransferChannel,
} from './channels/transferChannels/transferChannels';
import { initBackgroundFeeChannel } from './channels/feeChannel/feeChannel';
import {
  initBackgroundForgetAllPasswordsChannel,
  initBackgroundForgetPasswordChannel,
  initBackgroundGetPasswordChannel,
  initBackgroundHasSavedPasswordsChannel,
  initBackgroundSavePasswordChannel,
  schedulePasswordsCheck,
} from './channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { popupTabRemovedListener } from './channels/base/PopupChannel/PopupMessages';
import { initBackgroundBalanceChangeChannel } from './channels/balanceChangeChannel/balanceChangeChannel';
import {
  connectToBlockchain,
  onPopupConnect,
} from './channels/ExtensionPopupMessages/ExtensionPopupMessages';
import { initBackgroundSignChannel } from './dApps/SignChannels/backgroundSignChannel';
import { initBackgroundSaveChannel } from './channels/SaveChannels/browserSaveChannels';
import { initBackgroundClaimChannel } from './channels/ClaimChannels/browserClaimChannels';
import { initBackgroundShareChannel } from './channels/ShareChannels/browserShareChannels';
import { initBackgroundAccessChannel } from './dApps/AccessChannels/browserAccessChannels';
import { initBackgroundExistentialDepositChannel } from './channels/existentialDepositChannel/existentialDepositChannel';
import { initBackgroundGenesisHashChannel } from './dApps/genesisHashChannel/initBackgroundGenesisHashChannel';

import {
  initBackgroundHasVestedFundsChannel,
  initBackgroundVestChannels,
} from './channels/VestingChannels/VestingChannels';

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
  initBackgroundClaimChannel();
  initBackgroundSaveChannel();
  initBackgroundShareChannel();
  initBackgroundSignChannel();
  browser.tabs.onRemoved.addListener(popupTabRemovedListener);
}

function initExtensionPopupMessages() {
  onPopupConnect(connectToBlockchain);
}

function initTransferChannels() {
  initBackgroundSignTransferChannel();
  initBackgroundSubmitTransferChannel();
}

function initVestingChannels() {
  initBackgroundHasVestedFundsChannel();
  initBackgroundVestChannels();
}

function init() {
  initKiltSDK();
  initExtensionPopupMessages();
  initBackgroundBalanceChangeChannel();
  initBackgroundFeeChannel();
  initTransferChannels();
  initBackgroundToggleIconChannel();
  initSavedPasswords();
  initDAppChannels();
  initBackgroundExistentialDepositChannel();
  initBackgroundGenesisHashChannel();
  initVestingChannels();
}

init();
