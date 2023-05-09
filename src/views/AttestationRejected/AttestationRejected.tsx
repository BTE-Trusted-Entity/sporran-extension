import { useCallback, useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { find } from 'lodash-es';

import * as styles from './AttestationRejected.module.css';

import { usePopupData } from '../../utilities/popups/usePopupData';
import {
  deleteCredential,
  saveCredential,
  useCredentials,
} from '../../utilities/credentials/credentials';
import { rejectChannel } from '../../channels/rejectChannel/rejectChannel';
import { CredentialCard } from '../../components/CredentialCard/CredentialCard';
import { UnknownCredential } from '../../components/UnknownCredential/UnknownCredential';
import { RejectInput } from '../../channels/rejectChannel/types';

export function AttestationRejected(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const rootHash = usePopupData<RejectInput>();

  const sporranCredentials = useCredentials();
  const sporranCredential = find(sporranCredentials, {
    credential: { rootHash },
  });

  const handleRemoveClick = useCallback(async () => {
    if (sporranCredential) {
      await deleteCredential(sporranCredential);
    }
    window.close();
  }, [sporranCredential]);

  const handleKeepClick = useCallback(() => {
    window.close();
  }, []);

  useEffect(() => {
    (async () => {
      await rejectChannel.return(undefined);
      if (sporranCredential) {
        await saveCredential({ ...sporranCredential, status: 'rejected' });
      }
    })();
  }, [sporranCredential]);

  if (!sporranCredentials) {
    return null; // storage data pending
  }

  if (!sporranCredential) {
    return <UnknownCredential rootHash={rootHash} />;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_AttestationRejected_heading')}
      </h1>

      <p className={styles.info}>{t('view_AttestationRejected_info')}</p>

      <section className={styles.cardContainer}>
        <CredentialCard
          sporranCredential={sporranCredential}
          expand
          collapsible={false}
          buttons={false}
        />
      </section>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.keep} onClick={handleKeepClick}>
          {t('view_AttestationRejected_keep')}
        </button>
        <button
          type="button"
          className={styles.remove}
          onClick={handleRemoveClick}
        >
          {t('view_AttestationRejected_remove')}
        </button>
      </p>
    </main>
  );
}
