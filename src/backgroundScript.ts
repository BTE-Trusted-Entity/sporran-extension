import { browser } from 'webextension-polyfill-ts';

import { initBlockChainConnection } from './connection/initBlockChainConnection/initBlockChainConnection';
import { transferMessageListener } from './connection/TransferMessages/TransferMessages';
import { feeMessageListener } from './connection/FeeMessages/FeeMessages';
import {
  forgetAllPasswordsListener,
  forgetPasswordListener,
  getPasswordListener,
  hasSavedPasswordsListener,
  savePasswordListener,
  schedulePasswordsCheck,
} from './connection/SavedPasswordsMessages/SavedPasswordsMessages';
import {
  popupRequestListener,
  popupResponseListener,
  popupTabRemovedListener,
} from './connection/PopupMessages/PopupMessages';
import { balanceMessageListener } from './connection/BalanceMessages/BalanceMessages';

export function initBalanceMessages(): void {
  browser.runtime.onMessage.addListener(balanceMessageListener);
}

function initFeeMessages(): void {
  browser.runtime.onMessage.addListener(feeMessageListener);
}

function initSavedPasswords(): void {
  schedulePasswordsCheck();
  browser.runtime.onMessage.addListener(savePasswordListener);
  browser.runtime.onMessage.addListener(getPasswordListener);
  browser.runtime.onMessage.addListener(forgetPasswordListener);
  browser.runtime.onMessage.addListener(forgetAllPasswordsListener);
  browser.runtime.onMessage.addListener(hasSavedPasswordsListener);
}

function initTransferMessages(): void {
  browser.runtime.onMessage.addListener(transferMessageListener);
}

export function initPopupMessages(): void {
  browser.runtime.onMessage.addListener(popupRequestListener);
  browser.runtime.onMessage.addListener(popupResponseListener);
  browser.tabs.onRemoved.addListener(popupTabRemovedListener);
}

function init() {
  initBlockChainConnection();
  initBalanceMessages();
  initFeeMessages();
  initSavedPasswords();
  initTransferMessages();
  initPopupMessages();
}

init();
browser.runtime.onInstalled.addListener(init);
