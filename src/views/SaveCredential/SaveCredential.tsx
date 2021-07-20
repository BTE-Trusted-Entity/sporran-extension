import { Fragment, useCallback, useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { useQuery } from '../../utilities/useQuery/useQuery';
import {
  saveCredential,
  useCredential,
} from '../../utilities/credentials/credentials';

import styles from './SaveCredential.module.css';

export function SaveCredential(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { claimHash } = useQuery();

  // TODO: Is this whole flow necessary?
  const credential = useCredential(claimHash);

  useEffect(() => {
    (async () => {
      if (credential) {
        credential.isAttested = true;
        await saveCredential(credential);
      }
    })();
  }, [credential]);

  const handleCancel = useCallback(() => {
    window.close();
  }, []);

  if (!credential) {
    return null; // storage data pending
  }

  const values = [
    ...Object.entries(credential.request.claim.contents),
    ['Credential type', credential.cTypeTitle],
    ['Attester', credential.attester],
  ];

  const downloadName = `${credential.cTypeTitle}-${values[0][1]}.json`;
  const downloadBlob = window.btoa(JSON.stringify(credential));

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t('view_SaveCredential_heading')}</h1>
      <p className={styles.subline}>{t('view_SaveCredential_subline')}</p>

      <dl className={styles.details}>
        {values.map(([name, value]) => (
          <Fragment key={name}>
            <dt className={styles.detailName}>{name}:</dt>
            <dd className={styles.detailValue}>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <h2 className={styles.warning}>{t('view_SaveCredential_warning')}</h2>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <a
          download={downloadName}
          href={`data:text/json;base64,${downloadBlob}`}
          className={styles.submit}
        >
          {t('view_SaveCredential_CTA')}
        </a>
      </p>
    </main>
  );
}
