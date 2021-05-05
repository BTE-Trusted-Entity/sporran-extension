import { browser } from 'webextension-polyfill-ts';

import { initBlockChainConnection } from './connection/initBlockChainConnection/initBlockChainConnection';
import { initBalanceMessages } from './connection/initBalanceMessages/initBalanceMessages';
import { initFeeMessages } from './connection/initFeeMessages/initFeeMessages';
import { initSavedPasswords } from './connection/initSavedPasswords/initSavedPasswords';
import { initTransferMessages } from './connection/initTransferMessages/initTransferMessages';
import { initPopupMessages } from './connection/initPopupMessages/initPopupMessages';

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
