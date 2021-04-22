import { browser } from 'webextension-polyfill-ts';

import { initBlockChainConnection } from './connection/initBlockChainConnection/initBlockChainConnection';
import { initBalanceMessages } from './connection/initBalanceMessages/initBalanceMessages';
import { initFeeMessages } from './connection/initFeeMessages/initFeeMessages';
import { initSavePassword } from './connection/initSavePassword/initSavePassword';

function init() {
  initBlockChainConnection();
  initBalanceMessages();
  initFeeMessages();
  initSavePassword();
}

init();
browser.runtime.onInstalled.addListener(init);
