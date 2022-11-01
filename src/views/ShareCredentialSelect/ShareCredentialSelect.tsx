import { useRef, RefObject } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import { sortBy } from 'lodash-es';

import * as styles from './ShareCredentialSelect.module.css';

import { Identity } from '../../utilities/identities/types';
import { useIdentities } from '../../utilities/identities/identities';
import {
  Credential,
  useCredentials,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { sameFullDid } from '../../utilities/did/did';
import { ShareInput } from '../../channels/shareChannel/types';

import { paths } from '../paths';

import { ShareCredentialCard } from '../../components/CredentialCard/ShareCredentialCard';
import { Stats } from '../../components/Stats/Stats';
import { IdentityLine } from '../../components/IdentityLine/IdentityLine';
import { Selected } from '../ShareCredential/ShareCredential';

function MatchingIdentityCredentials({
  identity,
  onSelect,
  selected,
  viewRef,
  allMatching,
  isLastIdentity,
}: {
  identity: Identity;
  onSelect: (value: Selected) => void;
  selected?: Selected;
  viewRef: RefObject<HTMLElement>;
  allMatching: Credential[];
  isLastIdentity: boolean;
}): JSX.Element {
  const credentials = allMatching.filter((credential) =>
    sameFullDid(credential.request.claim.owner, identity.did),
  );

  return (
    <section className={styles.identityCredentials}>
      <IdentityLine identity={identity} className={styles.identityLine} />
      <ul className={styles.list}>
        {credentials.map((credential, index) => (
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
            isLastOfFew={
              isLastIdentity &&
              allMatching.length < 7 &&
              index === credentials.length - 1
            }
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

  const credentials = useCredentials();

  const data = usePopupData<ShareInput>();
  const { credentialRequest } = data;
  const { cTypes } = credentialRequest;
  const cTypeHashes = cTypes.map(({ cTypeHash }) => cTypeHash);

  const matchingCredentials = credentials?.filter((credential) =>
    cTypeHashes.includes(credential.request.claim.cTypeHash),
  );

  const ref = useRef<HTMLElement>(null);

  if (!identities || !matchingCredentials) {
    return null; // storage data pending
  }

  const noMatchingCredentials = matchingCredentials.length === 0;

  const matchingCredentialDids = matchingCredentials.map(
    (credential) => credential.request.claim.owner,
  );
  const identitiesWithMatchingCredentials = Object.values(identities).filter(
    (identity) => matchingCredentialDids.includes(identity.did),
  );

  const sortedIdentities = sortBy(
    Object.values(identitiesWithMatchingCredentials),
    'index',
  );

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_ShareCredentialSelect_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_ShareCredentialSelect_subline')}
      </p>

      {noMatchingCredentials && (
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
        hidden={noMatchingCredentials}
      >
        {sortedIdentities.map((identity, index) => (
          <MatchingIdentityCredentials
            key={identity.address}
            identity={identity}
            onSelect={onSelect}
            selected={selected}
            allMatching={matchingCredentials}
            isLastIdentity={index === sortedIdentities.length - 1}
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

      <Stats />
    </section>
  );
}
