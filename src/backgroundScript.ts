import { browser } from 'webextension-polyfill-ts';

import {
  extensionPopupListener,
  initBlockChainConnection,
} from './connection/blockchainConnection/blockchainConnection';
import {
  onToggleIconRequest,
  toggleIconListener,
} from './connection/IconMessages/IconMessages';
import {
  onTransferRequest,
  transferMessageListener,
} from './connection/TransferMessages/TransferMessages';
import {
  feeMessageListener,
  onFeeRequest,
} from './connection/FeeMessages/FeeMessages';
import {
  forgetAllPasswordsListener,
  forgetPasswordListener,
  getPasswordListener,
  hasSavedPasswordsListener,
  onForgetAllPasswordsRequest,
  onForgetPasswordRequest,
  onGetPasswordRequest,
  onHasSavedPasswordsRequest,
  onSavePasswordRequest,
  savePasswordListener,
  schedulePasswordsCheck,
} from './connection/SavedPasswordsMessages/SavedPasswordsMessages';
import {
  onPopupRequest,
  onPopupResponse,
  popupRequestListener,
  popupResponseListener,
  popupTabRemovedListener,
} from './connection/PopupMessages/PopupMessages';
import {
  balanceMessageListener,
  onBalanceChangeRequest,
} from './connection/BalanceMessages/BalanceMessages';

export function initBalanceMessages(): void {
  onBalanceChangeRequest(balanceMessageListener);
}

function initFeeMessages(): void {
  onFeeRequest(feeMessageListener);
}

function initSavedPasswords(): void {
  schedulePasswordsCheck();
  onSavePasswordRequest(savePasswordListener);
  onGetPasswordRequest(getPasswordListener);
  onForgetPasswordRequest(forgetPasswordListener);
  onForgetAllPasswordsRequest(forgetAllPasswordsListener);
  onHasSavedPasswordsRequest(hasSavedPasswordsListener);
}

function initTransferMessages(): void {
  onTransferRequest(transferMessageListener);
}

export function initPopupMessages(): void {
  onPopupRequest(popupRequestListener);
  onPopupResponse(popupResponseListener);
  browser.tabs.onRemoved.addListener(popupTabRemovedListener);
}

function initToggleIcon(): void {
  onToggleIconRequest(toggleIconListener);
}

function initBlockchainConnection(): void {
  initBlockChainConnection();
  browser.runtime.onConnect.addListener(extensionPopupListener);
}

function init() {
  initBlockchainConnection();
  initBalanceMessages();
  initFeeMessages();
  initSavedPasswords();
  initTransferMessages();
  initPopupMessages();
  initToggleIcon();
}

init();
