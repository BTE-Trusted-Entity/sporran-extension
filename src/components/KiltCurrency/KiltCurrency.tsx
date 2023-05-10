import { browser } from 'webextension-polyfill-ts';
import { JSX } from 'react';

import * as styles from './KiltCurrency.module.css';

export function KiltCurrency(): JSX.Element {
  const t = browser.i18n.getMessage;
  return (
    <span
      aria-label={t('component_KiltCurrency_label')}
      className={styles.coin}
    />
  );
}
