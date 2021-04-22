import { browser } from 'webextension-polyfill-ts';

import { initBlockChainConnection } from './connection/initBlockChainConnection/initBlockChainConnection';
import { initBalanceMessages } from './connection/initBalanceMessages/initBalanceMessages';
import { initFeeMessages } from './connection/initFeeMessages/initFeeMessages';

function init() {
  initBlockChainConnection();
  initBalanceMessages();
  initFeeMessages();
}

init();
browser.runtime.onInstalled.addListener(init);
