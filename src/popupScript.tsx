import { createRoot } from 'react-dom/client';
import { browser } from 'webextension-polyfill-ts';

import { AppWithProviders } from './views/App/App';
import { connectToBackground } from './channels/ExtensionPopupMessages/ExtensionPopupMessages';
import { chromeMacBug } from './components/chromeMacBug/chromeMacBug';
import { resizePopup } from './channels/base/PopupChannel/PopupMessages';
import { checkTestEnvironment } from './utilities/checkTestEnvironment/checkTestEnvironment';

(async () => {
  await resizePopup();

  await browser.tabs.query({ active: true, currentWindow: true });
  connectToBackground();

  await chromeMacBug();
  document.documentElement.lang = browser.i18n.getUILanguage();

  await checkTestEnvironment();

  const root = createRoot(document.getElementById('popup') as HTMLElement);
  root.render(<AppWithProviders />);
})();
