import { useEffect, useRef, RefObject } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import { sortBy } from 'lodash-es';

import * as styles from './ShareCredentialSelect.module.css';

import { Identity } from '../../utilities/identities/types';
import { useIdentities } from '../../utilities/identities/identities';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';
import { ShareInput } from '../../channels/shareChannel/types';

import { paths } from '../paths';

import { ShareCredentialCard } from '../../components/CredentialCard/ShareCredentialCard';
import { IdentityLine } from '../../components/IdentityLine/IdentityLine';
import { Selected } from '../ShareCredential/ShareCredential';

function MatchingIdentityCredentials({
  identity,
  onSelect,
  selected,
  match,
  viewRef,
}: {
  identity: Identity;
  onSelect: (value: Selected) => void;
  selected?: Selected;
  match: () => void;
  viewRef: RefObject<HTMLElement>;
}): JSX.Element | null {
  const data = usePopupData<ShareInput>();

  const { credentialRequest } = data;

  const { cTypes } = credentialRequest;
  const cTypeHashes = cTypes.map(({ cTypeHash }) => cTypeHash);

  const credentials = useIdentityCredentials(identity.did);

  const matchingCredentials = credentials?.filter(
    (credential) =>
      cTypeHashes.includes(credential.kiltCredential.claim.cTypeHash) &&
      credential.kiltCredential.claim.owner === identity.did,
  );

  useEffect(() => {
    if (matchingCredentials && matchingCredentials.length > 0) {
      match();
    }
  }, [matchingCredentials, match]);

  if (!matchingCredentials) {
    return null; // storage data pending
  }

  if (matchingCredentials.length === 0) {
    return null;
  }

  return (
    <section className={styles.identityCredentials}>
      <IdentityLine identity={identity} className={styles.identityLine} />
      <ul className={styles.list}>
        {matchingCredentials.map((credential) => (
          <ShareCredentialCard
            key={credential.kiltCredential.rootHash}
            credential={credential}
            identity={identity}
            onSelect={onSelect}
            isSelected={Boolean(
              selected &&
                selected.credential.kiltCredential.rootHash ===
                  credential.kiltCredential.rootHash,
            )}
            viewRef={viewRef}
          />
        ))}
      </ul>
    </section>
  );
}

interface Props {
  onCancel: () => void;
  onSelect: (value: Selected) => void;
  selected?: Selected;
}

export function ShareCredentialSelect({
  onCancel,
  onSelect,
  selected,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const identities = useIdentities().data;

  const hasSome = useBooleanState();

  const ref = useRef<HTMLElement>(null);

  if (!identities) {
    return null; // storage data pending
  }

  const identitiesList = sortBy(Object.values(identities), 'index');

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_ShareCredentialSelect_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_ShareCredentialSelect_subline')}
      </p>

      {!hasSome.current && (
        <section className={styles.noCredentials}>
          <p className={styles.info}>
            {t('view_ShareCredentialSelect_no_credentials')}
          </p>

          <a
            href="https://socialkyc.io/"
            target="_blank"
            rel="noreferrer"
            className={styles.explainerLink}
          >
            {t('view_ShareCredentialSelect_explainer')}
          </a>
        </section>
      )}

      <section
        className={styles.allCredentials}
        ref={ref}
        hidden={!hasSome.current}
      >
        {identitiesList.map((identity) => (
          <MatchingIdentityCredentials
            key={identity.address}
            identity={identity}
            onSelect={onSelect}
            selected={selected}
            match={hasSome.on}
            viewRef={ref}
          />
        ))}
      </section>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          {t('common_action_cancel')}
        </button>
        <Link
          to={paths.popup.share.sign}
          className={styles.next}
          aria-disabled={!selected || selected.credential.status !== 'attested'}
        >
          {t('view_ShareCredentialSelect_next')}
        </Link>
      </p>
    </section>
  );
}
