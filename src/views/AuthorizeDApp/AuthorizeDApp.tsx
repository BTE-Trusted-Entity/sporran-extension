import browser from 'webextension-polyfill';
import { useCallback } from 'react';

import * as styles from './AuthorizeDApp.module.css';

import { usePopupData } from '../../utilities/popups/usePopupData';
import { backgroundAccessChannel } from '../../channels/AccessChannels/backgroundAccessChannels';
import { AccessOriginInput } from '../../channels/AccessChannels/types';

export function AuthorizeDApp() {
  const t = browser.i18n.getMessage;

  const { dAppName, origin } = usePopupData<AccessOriginInput>();

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
        {t('view_AuthorizeDApp_subline', [dAppName])}
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
