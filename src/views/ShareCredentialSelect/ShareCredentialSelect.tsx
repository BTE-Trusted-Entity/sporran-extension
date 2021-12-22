import { useRef, useEffect, useState, RefObject } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useLocation } from 'react-router-dom';
import { sortBy } from 'lodash-es';

import { Identity } from '../../utilities/identities/types';
import { useIdentities } from '../../utilities/identities/identities';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { ShareInput } from '../../channels/shareChannel/types';

import { paths } from '../paths';

import { useAddressBalance } from '../../components/Balance/Balance';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { ShareCredentialCard } from '../../components/CredentialCard/ShareCredentialCard';
import { Stats } from '../../components/Stats/Stats';
import { Avatar } from '../../components/Avatar/Avatar';
import { Selected } from '../ShareCredential/ShareCredential';

import * as styles from './ShareCredentialSelect.module.css';

function MatchingIdentityCredentials({
  identity,
  onSelect,
  selected,
}: {
  identity: Identity;
  onSelect: (value: Selected) => void;
  selected?: Selected;
}): JSX.Element | null {
  const data = usePopupData<ShareInput>();

  const { credentialRequest } = data;

  const { cTypes } = credentialRequest;
  const cTypeHashes = cTypes.map(({ cTypeHash }) => cTypeHash);

  const credentials = useIdentityCredentials(identity.did);

  const matchingCredentials = credentials?.filter(
    (credential) =>
      cTypeHashes.includes(credential.request.claim.cTypeHash) &&
      credential.request.claim.owner === identity.did,
  );

  const balance = useAddressBalance(identity.address);

  if (matchingCredentials.length === 0) {
    return null;
  }

  return (
    <section className={styles.identityCredentials}>
      <section className={styles.identityLine}>
        <section className={styles.identity}>
          <Avatar identity={identity} className={styles.avatar} />
          {identity.name}
        </section>
        {balance && <KiltAmount amount={balance.total} type="funds" />}
      </section>
      <ul className={styles.list}>
        {matchingCredentials.map((credential) => (
          <ShareCredentialCard
            key={credential.request.rootHash}
            credential={credential}
            identity={identity}
            onSelect={onSelect}
            isSelected={Boolean(
              selected &&
                selected.credential.request.rootHash ===
                  credential.request.rootHash,
            )}
          />
        ))}
      </ul>
    </section>
  );
}

function useHasChildNodes(ref: RefObject<HTMLElement | null>) {
  const [hasMatchingCredentials, setHasMatchingCredentials] =
    useState<boolean>();

  useEffect(() => {
    const hasChildren = ref.current?.hasChildNodes();
    console.log('current: ', ref.current);
    console.log('has Children: ', hasChildren);
    setHasMatchingCredentials(hasChildren);
  }, [ref]);

  return hasMatchingCredentials;
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

  const { search } = useLocation();

  const identities = useIdentities().data;

  const ref = useRef(null);

  const hasMatchingCredentials = useHasChildNodes(ref);

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

      {!hasMatchingCredentials && (
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
        id="allCredentials"
        hidden={!hasMatchingCredentials}
      >
        {identitiesList.map((identity) => (
          <MatchingIdentityCredentials
            key={identity.address}
            identity={identity}
            onSelect={onSelect}
            selected={selected}
          />
        ))}
      </section>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          {t('common_action_cancel')}
        </button>
        <Link
          to={paths.popup.share.sign + search}
          className={styles.next}
          aria-disabled={!selected || selected.credential.status !== 'attested'}
        >
          {t('view_ShareCredentialSelect_next')}
        </Link>
      </p>

      <Stats />
    </section>
  );
}
