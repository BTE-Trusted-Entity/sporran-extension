import browser from 'webextension-polyfill';
import { Link } from 'react-router-dom';

import * as styles from './Warning.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { paths } from '../paths';

export function Warning() {
  const t = browser.i18n.getMessage;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t('view_Warning_headline')}</h1>
      <h2 className={styles.important}>{t('view_Warning_emphasis')}</h2>
      <p className={styles.info}>{t('view_Warning_explanation')}</p>
      <h2 className={styles.important}>{t('view_Warning_emphasis_again')}</h2>
      <Link to={paths.identity.create.backup} className={styles.confirm}>
        {t('view_Warning_CTA')}
      </Link>
      <Link to={paths.home} className={styles.cancel}>
        {t('common_action_cancel')}
      </Link>

      <LinkBack />
    </div>
  );
}
