import { RefObject, useRef } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import { reject, sortBy } from 'lodash-es';
import { isSameSubject } from '@kiltprotocol/did';

import * as styles from './ShareCredentialSelect.module.css';

import { Identity } from '../../utilities/identities/types';
import { useIdentities } from '../../utilities/identities/identities';
import {
  SporranCredential,
  isUnusableCredential,
  useCredentials,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { parseDidUri } from '../../utilities/did/did';
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
  allCredentials,
  isLastIdentity,
}: {
  identity: Identity;
  onSelect: (value: Selected) => void;
  selected?: Selected;
  viewRef: RefObject<HTMLElement>;
  allCredentials: SporranCredential[];
  isLastIdentity: boolean;
}): JSX.Element {
  const credentials = allCredentials.filter(
    ({ credential }) =>
      identity.did && isSameSubject(credential.claim.owner, identity.did),
  );

  return (
    <section className={styles.identityCredentials}>
      <IdentityLine identity={identity} className={styles.identityLine} />
      <ul className={styles.list}>
        {credentials.map((sporranCredential, index) => (
          <ShareCredentialCard
            key={sporranCredential.credential.rootHash}
            sporranCredential={sporranCredential}
            identity={identity}
            onSelect={onSelect}
            isSelected={Boolean(
              selected &&
                selected.sporranCredential.credential.rootHash ===
                  sporranCredential.credential.rootHash,
            )}
            expand={
              isLastIdentity &&
              allCredentials.length < 7 &&
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

  const matchingCredentials = credentials?.filter(({ credential }) =>
    cTypeHashes.includes(credential.claim.cTypeHash),
  );

  const usableCredentials = reject(matchingCredentials, isUnusableCredential);

  const ref = useRef<HTMLElement>(null);

  if (!identities || !credentials) {
    return null; // storage data pending
  }

  const noUsableCredentials = usableCredentials.length === 0;

  const matchingCredentialDids = usableCredentials.map(
    ({ credential }) => parseDidUri(credential.claim.owner).fullDid,
  );
  const identitiesWithMatchingCredentials = Object.values(identities).filter(
    ({ did }) =>
      did && matchingCredentialDids.includes(parseDidUri(did).fullDid),
  );

  const sortedIdentities = sortBy(identitiesWithMatchingCredentials, 'index');

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_ShareCredentialSelect_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_ShareCredentialSelect_subline')}
      </p>

      {noUsableCredentials && (
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

      {!noUsableCredentials && (
        <section className={styles.allCredentials} ref={ref}>
          {sortedIdentities.map((identity, index) => (
            <MatchingIdentityCredentials
              key={identity.address}
              identity={identity}
              onSelect={onSelect}
              selected={selected}
              allCredentials={usableCredentials}
              isLastIdentity={index === sortedIdentities.length - 1}
              viewRef={ref}
            />
          ))}
        </section>
      )}

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          {t('common_action_cancel')}
        </button>
        <Link
          to={paths.popup.share.sign}
          className={styles.next}
          aria-disabled={
            !selected || selected.sporranCredential.status !== 'attested'
          }
        >
          {t('view_ShareCredentialSelect_next')}
        </Link>
      </p>

      <Stats />
    </section>
  );
}
