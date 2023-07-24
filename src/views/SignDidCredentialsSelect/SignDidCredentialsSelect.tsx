import browser from 'webextension-polyfill';

import { JSX, useRef, useState, useCallback } from 'react';

import { omit } from 'lodash-es';

import * as styles from './SignDidCredentialsSelect.module.css';

import { Identity } from '../../utilities/identities/types';
import {
  SharedCredential,
  useIdentityCredentials,
} from '../../utilities/credentials/credentials';

import { IdentityLine } from '../../components/IdentityLine/IdentityLine';
import { SignDidCredentialCard } from '../../components/CredentialCard/SignDidCredentialCard';
import { LinkBack } from '../../components/LinkBack/LinkBack';

interface Props {
  identity: Identity;
  onCancel: () => void;
  onSubmit: (selected: SharedCredential[]) => void;
}

export function SignDidCredentialsSelect({
  identity,
  onCancel,
  onSubmit,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const sporranCredentials = useIdentityCredentials(identity.did);

  const ref = useRef<HTMLElement>(null);

  const [selected, setSelected] = useState<Record<string, SharedCredential>>();

  const onSelect = useCallback(
    (presentation: SharedCredential) => {
      const key = presentation.sporranCredential.credential.rootHash;
      setSelected({ ...selected, [key]: presentation });
    },
    [selected],
  );

  const onUnSelect = useCallback(
    (key: string) => {
      setSelected(omit(selected, key));
    },
    [selected],
  );

  const handleSubmit = useCallback(() => {
    if (!selected) {
      return;
    }
    onSubmit(Object.values(selected));
  }, [selected, onSubmit]);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>
        {t('view_SignDidCredentialsSelect_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidCredentialsSelect_subline')}
      </p>

      <section className={styles.credentials} ref={ref}>
        <IdentityLine identity={identity} className={styles.identityLine} />

        <ul className={styles.list}>
          {sporranCredentials?.map((sporranCredential) => (
            <SignDidCredentialCard
              key={sporranCredential.credential.rootHash}
              sporranCredential={sporranCredential}
              onSelect={onSelect}
              onUnSelect={onUnSelect}
              viewRef={ref}
            />
          ))}
        </ul>
      </section>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          {t('common_action_cancel')}
        </button>
        <button
          type="submit"
          className={styles.next}
          disabled={!selected || !Object.entries(selected).length}
        >
          {t('view_SignDidCredentialsSelect_next')}
        </button>
      </p>

      <LinkBack />
    </form>
  );
}
