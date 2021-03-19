import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths } from '../paths';

import styles from './Warning.module.css';

export function Warning(): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <div className={styles.container}>
      <Link to={paths.home} className={styles.backButton}>
        {t('common_action_back')}
      </Link>
      <h1>{t('view_Warning_headline')}</h1>
      <div>
        <h3>[Insert logo here]</h3>
      </div>
      <h2>{t('view_Warning_emphasis')}</h2>
      <p>{t('view_Warning_explanation')}</p>
      <h2>{t('view_Warning_emphasis_again')}</h2>
      <p>
        <Link to={paths.account.create.backup}>{t('view_Warning_CTA')}</Link>
      </p>
      <p>
        <Link to={paths.home}>{t('common_action_cancel')}</Link>
      </p>
    </div>
  );
}
