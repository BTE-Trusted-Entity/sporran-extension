import { JSX, useCallback, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { IAttestation } from '@kiltprotocol/sdk-js';

import * as styles from './SaveCredential.module.css';

import {
  getCredentialDownload,
  saveCredential,
  useCredentials,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { saveChannel } from '../../channels/saveChannel/saveChannel';
import { CredentialCard } from '../../components/CredentialCard/CredentialCard';
import { UnknownCredential } from '../../components/UnknownCredential/UnknownCredential';

export function SaveCredential(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { claimHash } = usePopupData<IAttestation>();

  const sporranCredentials = useCredentials();

  const sporranCredential = sporranCredentials?.find(
    ({ credential: { rootHash } }) => rootHash === claimHash,
  );

  const handleDownloadClick = useCallback(async () => {
    if (!sporranCredential) {
      return;
    }
    await saveCredential({ ...sporranCredential, isDownloaded: true });
  }, [sporranCredential]);

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  useEffect(() => {
    (async () => {
      await saveChannel.return(undefined);
    })();
  }, []);

  if (!sporranCredentials) {
    return null; // storage data pending
  }

  if (!sporranCredential) {
    return <UnknownCredential rootHash={claimHash} />;
  }

  const download = getCredentialDownload(sporranCredential);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_SaveCredential_heading')}</h1>

      <section className={styles.cardContainer}>
        <CredentialCard
          sporranCredential={sporranCredential}
          expand
          collapsible={false}
          buttons={false}
        />
      </section>

      <h2
        className={
          sporranCredential.isDownloaded ? styles.downloaded : styles.warning
        }
      >
        {t('view_SaveCredential_warning')}
      </h2>

      <a
        download={download.name}
        href={download.url}
        className={styles.download}
        onClick={handleDownloadClick}
      >
        {t('view_SaveCredential_CTA')}
      </a>

      {sporranCredential.isDownloaded && (
        <p className={styles.done}>
          {t('view_SaveCredential_done')}
          <button type="button" className={styles.close} onClick={handleClose}>
            {t('view_SaveCredential_close')}
          </button>
        </p>
      )}
    </main>
  );
}
