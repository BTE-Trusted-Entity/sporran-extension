import { useCallback, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { IAttestation } from '@kiltprotocol/types';

import {
  Credential,
  getCredential,
  getCredentialDownload,
  saveCredential,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';

import { saveChannel } from '../../channels/saveChannel/saveChannel';

import { CredentialCard } from '../../components/CredentialCard/CredentialCard';

import * as styles from './SaveCredential.module.css';

function useSaveCredential(credential: Credential | null) {
  useEffect(() => {
    (async () => {
      if (credential && credential.name && credential.name.length > 0) {
        await saveCredential(credential);
        await saveChannel.return(undefined);
      }
    })();
  }, [credential]);
}

export function SaveCredential(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { claimHash } = usePopupData<IAttestation>();

  const [credential, setCredential] = useState<Credential | null>(null);

  useSaveCredential(credential);

  useEffect(() => {
    (async () => {
      try {
        const savedCredential = await getCredential(claimHash);
        setCredential({ ...savedCredential, status: 'attested' });
      } catch (error) {
        console.error(error);
        // TODO: decide on the interface for an unknown credential
      }
    })();
  }, [claimHash]);

  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownloadClick = useCallback(() => {
    setIsDownloaded(true);
  }, []);

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  if (!credential) {
    return null; // storage data pending
  }

  const download = getCredentialDownload(credential);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_SaveCredential_heading')}</h1>

      <section className={styles.cardContainer}>
        <CredentialCard credential={credential} expand buttons={false} />
      </section>

      <h2 className={isDownloaded ? styles.downloaded : styles.warning}>
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

      {isDownloaded && (
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
