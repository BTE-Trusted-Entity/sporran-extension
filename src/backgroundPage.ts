import { browser } from 'webextension-polyfill-ts';

import { initBlockChainConnection } from './connection/initBlockChainConnection/initBlockChainConnection';
import { initBalanceMessages } from './connection/initBalanceMessages/initBalanceMessages';

function init() {
  initBlockChainConnection();
  initBalanceMessages();
}

init();
browser.runtime.onInstalled.addListener(init);
