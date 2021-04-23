import { browser } from 'webextension-polyfill-ts';

import { initBlockChainConnection } from './connection/initBlockChainConnection/initBlockChainConnection';
import { initBalanceMessages } from './connection/initBalanceMessages/initBalanceMessages';
import { initFeeMessages } from './connection/initFeeMessages/initFeeMessages';
import { initSavedPasswords } from './connection/initSavedPasswords/initSavedPasswords';

function init() {
  initBlockChainConnection();
  initBalanceMessages();
  initFeeMessages();
  initSavedPasswords();
}

init();
browser.runtime.onInstalled.addListener(init);
