import { browser } from 'webextension-polyfill-ts';
import { useCallback } from 'react';

import { useQuery } from '../../utilities/useQuery/useQuery';
import { backgroundAccessChannel } from '../../dApps/AccessChannels/browserAccessChannels';

import styles from './AuthorizeDApp.module.css';

export function AuthorizeDApp(): JSX.Element {
  const t = browser.i18n.getMessage;

  const { name, origin } = useQuery();

  const handleAuthorizeClick = useCallback(async () => {
    await backgroundAccessChannel.return(true);
    window.close();
  }, []);

  const handleRejectClick = useCallback(async () => {
    await backgroundAccessChannel.return(false);
    window.close();
  }, []);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_AuthorizeDApp_title')}</h1>
      <p className={styles.subline}>
        {t('view_AuthorizeDApp_subline', [name])}
      </p>

      <p className={styles.origin}>{origin}</p>
      <p className={styles.warning}>{t('view_AuthorizeDApp_warning')}</p>

      <button onClick={handleAuthorizeClick} className={styles.authorize}>
        {t('view_AuthorizeDApp_CTA')}
      </button>

      <button onClick={handleRejectClick} className={styles.reject}>
        {t('view_AuthorizeDApp_reject')}
      </button>
    </section>
  );
}
