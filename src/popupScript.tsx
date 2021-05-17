import { render } from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import { AppWithProviders } from './views/App/App';
import { connectToBackground } from './connection/ExtensionPopupMessages/ExtensionPopupMessages';

(async () => {
  await browser.tabs.query({ active: true, currentWindow: true });
  connectToBackground();
  render(<AppWithProviders />, document.getElementById('popup'));
  document.documentElement.lang = browser.i18n.getUILanguage();
})();
