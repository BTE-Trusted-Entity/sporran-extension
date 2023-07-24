import browser from 'webextension-polyfill';

import * as styles from './chromeMacBug.module.css';

const { screen, screenTop, screenLeft } = window;

const displayIsSecondary =
  screenLeft < 0 ||
  screenTop < 0 ||
  screenLeft > screen.width ||
  screenTop > screen.height;

/**
 * This is a workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 * Chrome@Mac on a secondary display with DPI less than on main display freezes the popup.
 * Repainting every second alleviates the problem.
 */
export async function chromeMacBug(): Promise<void> {
  const { os } = await browser.runtime.getPlatformInfo();
  const isMac = os === 'mac';

  if (isMac && displayIsSecondary) {
    document.documentElement.classList.add(styles.redrawForever);
  }
}
