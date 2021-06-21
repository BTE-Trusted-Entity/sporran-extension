import { Fragment, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { useQuery } from '../../utilities/useQuery/useQuery';

import styles from './SaveCredential.module.css';

export function SaveCredential(): JSX.Element {
  const t = browser.i18n.getMessage;

  const { credential, ...query } = useQuery();
  const values = [...Object.entries(query)];

  const handleCancel = useCallback(() => {
    window.close();
  }, []);

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
          download="BL-Mail-Simple-ingo@kilt.io.json"
          href={`data:text/json;base64,${credential}`}
          className={styles.submit}
        >
          {t('view_SaveCredential_CTA')}
        </a>
      </p>
    </main>
  );
}
