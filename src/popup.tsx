import { render } from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import { App } from './views/App/App';

(async () => {
  await browser.tabs.query({ active: true, currentWindow: true });
  render(<App />, document.getElementById('popup'));
  document.documentElement.lang = browser.i18n.getUILanguage();
})();
