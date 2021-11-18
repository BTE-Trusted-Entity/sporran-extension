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

import * as styles from './SaveCredential.module.css';

function useSaveCredential(credential: Credential | null) {
  useEffect(() => {
    (async () => {
      if (credential && credential.name && credential.name.length > 0) {
        await saveCredential(credential);
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

  const handleNameInput = useCallback(
    async (event) => {
      const name = event.target.value as string;
      if (credential) {
        setCredential({ ...credential, name });
      }
    },
    [credential],
  );

  const handleCancel = useCallback(() => {
    window.close();
  }, []);

  if (!credential) {
    return null; // storage data pending
  }

  const download = getCredentialDownload(credential);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_SaveCredential_heading')}</h1>

      <dl className={styles.details}>
        <dt className={styles.detailName}>Credential type:</dt>
        <dd className={styles.detailValue}>{credential.cTypeTitle}</dd>

        <dt className={styles.detailName}>Attester:</dt>
        <dd className={styles.detailValue}>{credential.attester}</dd>
      </dl>

      <h2 className={styles.warning}>{t('view_SaveCredential_warning')}</h2>

      <label className={styles.label}>
        {t('view_SaveCredential_name')}
        <input
          name="name"
          className={styles.name}
          onInput={handleNameInput}
          autoFocus
          defaultValue={credential.name}
        />
      </label>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <a
          download={download.name}
          href={download.url}
          className={styles.submit}
          aria-disabled={!credential.name || credential.name.length === 0}
        >
          {t('view_SaveCredential_CTA')}
        </a>
      </p>
    </main>
  );
}
