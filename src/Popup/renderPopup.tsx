import { render } from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import { Popup } from './Popup';

(async () => {
  await browser.tabs.query({ active: true, currentWindow: true });
  render(<Popup />, document.getElementById('popup'));
  document.documentElement.lang = browser.i18n.getUILanguage();
})();
