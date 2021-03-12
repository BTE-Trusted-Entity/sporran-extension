import { browser } from 'webextension-polyfill-ts';

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(() => {
  // do nothing so far
});
