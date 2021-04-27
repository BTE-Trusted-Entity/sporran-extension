import { browser } from 'webextension-polyfill-ts';

import { initBlockChainConnection } from './connection/initBlockChainConnection/initBlockChainConnection';
import { initBalanceMessages } from './connection/initBalanceMessages/initBalanceMessages';
import { initFeeMessages } from './connection/initFeeMessages/initFeeMessages';
import { initSavedPasswords } from './connection/initSavedPasswords/initSavedPasswords';
import { initTransferMessages } from './connection/initTransferMessages/initTransferMessages';

function init() {
  initBlockChainConnection();
  initBalanceMessages();
  initFeeMessages();
  initSavedPasswords();
  initTransferMessages();
}

init();
browser.runtime.onInstalled.addListener(init);
