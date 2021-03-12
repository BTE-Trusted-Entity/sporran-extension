import { browser } from 'webextension-polyfill-ts';

import styles from './Welcome.module.css';

export function Welcome(): JSX.Element {
  const t = browser.i18n.getMessage;

  function NextView() {
    // TODO: navigate to warning view
  }
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_Welcome_heading')}</h1>
      <h3 className={styles.info}>{t('view_Welcome_info')}</h3>
      <h3 className={styles.info}>{t('view_Welcome_invitation')}</h3>
      <button className={styles.button} onClick={NextView}>
        {t('view_Welcome_create')}
      </button>
      {/* TODO: Navigate to restore account view */}
      <a href="#" onClick={(e) => e.preventDefault()}>
        {t('view_Welcome_import')}
      </a>
    </div>
  );
}
