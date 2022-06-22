import { browser } from 'webextension-polyfill-ts';
import { Link, useLocation } from 'react-router-dom';

import { useRef } from 'react';

import * as styles from './SignDidCredentialsSelect.module.css';

import { Identity } from '../../utilities/identities/types';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';

import { generatePath, paths } from '../paths';

import { IdentityLine } from '../../components/IdentityLine/IdentityLine';
import { SignDidCredentialCard } from '../../components/CredentialCard/SignDidCredentialCard';
import { Presentation } from '../SignDidFlow/SignDidFlow';

interface Props {
  identity: Identity;
  onCancel: () => void;
  onSelect: (value: Presentation) => void;
  onUnSelect: (rootHash: string) => void;
  selected?: Record<string, Presentation>;
}

export function SignDidCredentialsSelect({
  identity,
  onCancel,
  onSelect,
  onUnSelect,
  selected,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { search: popupData } = useLocation();

  const credentials = useIdentityCredentials(identity.did);

  const ref = useRef<HTMLElement>(null);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_SignDidCredentialsSelect_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidCredentialsSelect_subline')}
      </p>

      <section className={styles.credentials} ref={ref}>
        <IdentityLine identity={identity} className={styles.identityLine} />

        <ul className={styles.list}>
          {credentials?.map((credential) => (
            <SignDidCredentialCard
              key={credential.request.rootHash}
              credential={credential}
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
        <Link
          to={generatePath(paths.popup.signDid.sign + popupData, {
            address: identity.address,
          })}
          className={styles.next}
          aria-disabled={!selected || !Object.entries(selected).length}
        >
          {t('view_SignDidCredentialsSelect_next')}
        </Link>
      </p>
    </section>
  );
}
