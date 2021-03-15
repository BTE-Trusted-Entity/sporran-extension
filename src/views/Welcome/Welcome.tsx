import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import styles from './Welcome.module.css';

export function Welcome(): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_Welcome_heading')}</h1>

      <h3 className={styles.info}>{t('view_Welcome_info')}</h3>
      <h3 className={styles.info}>{t('view_Welcome_invitation')}</h3>

      <Link to="/account/create" className={styles.buttonContainer}>
        {t('view_Welcome_create')}
      </Link>

      <Link to="/account/import">{t('view_Welcome_import')}</Link>
    </div>
  );
}
