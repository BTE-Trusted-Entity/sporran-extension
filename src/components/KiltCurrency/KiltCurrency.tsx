import browser from 'webextension-polyfill';

import * as styles from './KiltCurrency.module.css';

export function KiltCurrency() {
  const t = browser.i18n.getMessage;
  return (
    <span
      aria-label={t('component_KiltCurrency_label')}
      className={styles.coin}
    />
  );
}
