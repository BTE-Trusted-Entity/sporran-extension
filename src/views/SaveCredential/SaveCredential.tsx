import { useCallback, useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { IAttestation } from '@kiltprotocol/types';

import * as styles from './SaveCredential.module.css';

import {
  getCredentialDownload,
  saveCredential,
  useCredentials,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';

import { saveChannel } from '../../channels/saveChannel/saveChannel';

import { CredentialCard } from '../../components/CredentialCard/CredentialCard';

export function SaveCredential(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { claimHash } = usePopupData<IAttestation>();

  const credentials = useCredentials();

  const credential = credentials?.find(
    (credential) => credential.kiltCredential.rootHash === claimHash,
  );

  const handleDownloadClick = useCallback(async () => {
    if (!credential) {
      return;
    }
    await saveCredential({ ...credential, isDownloaded: true });
  }, [credential]);

  const handleClose = useCallback(() => {
    window.close();
  }, []);

  useEffect(() => {
    (async () => {
      await saveChannel.return(undefined);
    })();
  }, []);

  if (!credentials) {
    return null; // storage data pending
  }

  if (!credential) {
    // TODO: decide on interface for an unknown credential
    return null;
  }

  const download = getCredentialDownload(credential);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_SaveCredential_heading')}</h1>

      <section className={styles.cardContainer}>
        <CredentialCard
          credential={credential}
          expand
          collapsible={false}
          buttons={false}
        />
      </section>

      <h2
        className={credential.isDownloaded ? styles.downloaded : styles.warning}
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

      {credential.isDownloaded && (
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
