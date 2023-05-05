import { browser } from 'webextension-polyfill-ts';
import { ChangeEvent, useCallback, useEffect } from 'react';

import * as styles from './CredentialCard.module.css';

import { SporranCredential } from '../../utilities/credentials/credentials';

interface Props {
  sporranCredential: SporranCredential;
  onSelect: (value: string[]) => void;
}

export function PresentCredentialCard({
  sporranCredential,
  onSelect,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { cTypeTitle, attester, credential, name, status } = sporranCredential;
  const contents = Object.entries(credential.claim.contents);
  const isAttested = status === 'attested';

  const handlePropChecked = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const formData = new FormData(event.target.form as HTMLFormElement);
      onSelect([...formData.keys()]);
    },
    [onSelect],
  );

  useEffect(() => {
    onSelect(Object.keys(credential.claim.contents));
  }, [onSelect, credential.claim.contents]);

  const statuses = {
    pending: t('component_CredentialCard_pending'),
    attested: t('component_CredentialCard_attested'),
    revoked: t('component_CredentialCard_revoked'),
    rejected: t('component_CredentialCard_rejected'),
    invalid: t('component_CredentialCard_invalid'),
  };

  return (
    <form className={styles.credential}>
      <section className={styles.expanded}>
        <section className={!isAttested ? styles.notUsable : undefined}>
          <dl className={styles.details}>
            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_name')}
              </dt>
              <dd className={styles.detailValue}>{name}</dd>
            </div>
            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_status')}
              </dt>
              <dd className={styles.detailValue}>{statuses[status]}</dd>
            </div>

            {contents.map(([name, value]) => (
              <div key={name} className={styles.detail}>
                <dt className={styles.detailName}>{name}</dt>
                <dd className={styles.detailValue}>
                  <label className={styles.shareLabel}>
                    <input
                      type="checkbox"
                      name={name}
                      className={styles.share}
                      defaultChecked
                      onChange={handlePropChecked}
                      disabled={!isAttested}
                    />
                    <span />
                    {String(value)}
                  </label>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <h4 className={styles.technical}>
          {t('component_CredentialCard_technical')}
        </h4>

        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt className={styles.detailName}>
              {t('component_CredentialCard_ctype')}
            </dt>
            <dd className={styles.detailValue}>{cTypeTitle}</dd>
          </div>
          <div className={styles.detail}>
            <dt className={styles.detailName}>
              {t('component_CredentialCard_attester')}
            </dt>
            <dd className={styles.detailValue}>{attester}</dd>
          </div>
          <div className={styles.hash}>
            <dt className={styles.detailName}>
              {t('component_CredentialCard_hash')}
            </dt>
            <dd className={styles.detailValue}>{credential.rootHash}</dd>
          </div>
        </dl>
      </section>
    </form>
  );
}
