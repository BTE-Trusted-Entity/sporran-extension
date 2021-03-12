import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import styles from './Warning.module.css';

export function Warning(): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>
        {t('common_action_back')}
      </Link>
      <h1>{t('view_Warning_headline')}</h1>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h2>{t('view_Warning_emphasis')}</h2>
      <p>{t('view_Warning_explanation')}</p>
      <h2>{t('view_Warning_emphasis_again')}</h2>
      <Link to="/account/create/verify" className={styles.buttonContainer}>
        <button className={styles.button}>{t('view_Warning_CTA')}</button>
      </Link>
      <Link to="/">{t('common_action_cancel')}</Link>
    </div>
  );
}
