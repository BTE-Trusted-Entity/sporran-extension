import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { paths } from '../paths';

import arrowLeft from '../../components/images/arrow-left.svg';
import styles from './Warning.module.css';

export function Warning(): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <div className={styles.container}>
      <Link to={paths.home} className={styles.backButton}>
        <img alt={t('common_action_back')} src={arrowLeft} />
      </Link>
      <h1 className={styles.heading}>{t('view_Warning_headline')}</h1>
      <div className={styles.hand} />
      <h2 className={styles.important}>{t('view_Warning_emphasis')}</h2>
      <p className={styles.info}>{t('view_Warning_explanation')}</p>
      <h2 className={styles.important}>{t('view_Warning_emphasis_two')}</h2>
      <h2 className={styles.important}>{t('view_Warning_emphasis_three')}</h2>
      <Link to={paths.account.create.backup} className={styles.confirm}>
        {t('view_Warning_CTA')}
      </Link>
      <Link to={paths.home} className={styles.cancel}>
        {t('common_action_cancel')}
      </Link>
    </div>
  );
}
