import { FormEvent, JSX, RefObject, useCallback, useRef } from 'react';
import browser from 'webextension-polyfill';
import { reject, sortBy } from 'lodash-es';
import { Did, DidUri } from '@kiltprotocol/sdk-js';

import { useHistory } from 'react-router';

import { Modal } from 'react-dialog-polyfill';

import * as styles from './ShareCredentialSelect.module.css';

import { Identity } from '../../utilities/identities/types';
import { useIdentities } from '../../utilities/identities/identities';
import {
  SporranCredential,
  useCredentials,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { parseDidUri } from '../../utilities/did/did';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';
import { ShareInput } from '../../channels/shareChannel/types';

import { paths } from '../paths';

import { ShareCredentialCard } from '../../components/CredentialCard/ShareCredentialCard';
import { Stats } from '../../components/Stats/Stats';
import { IdentityLine } from '../../components/IdentityLine/IdentityLine';
import { Selected } from '../ShareCredential/ShareCredential';

function ConfirmModal({
  onConfirm,
  onReject,
}: {
  onConfirm: () => void;
  onReject: () => void;
}) {
  const t = browser.i18n.getMessage;

  return (
    <Modal open className={styles.confirm}>
      <h1 className={styles.confirmWarning}>
        {t('view_ShareCredentialSelect_confirm_warning')}
      </h1>

      <p className={styles.confirmInfo}>
        {t('view_ShareCredentialSelect_confirm_info')}
      </p>

      <button className={styles.confirmCancel} type="button" onClick={onReject}>
        {t('common_action_back')}
      </button>
      <button className={styles.confirmNext} type="button" onClick={onConfirm}>
        {t('common_action_continue')}
      </button>
    </Modal>
  );
}

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
      identity.did && Did.isSameSubject(credential.claim.owner, identity.did),
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
  const history = useHistory();

  const identities = useIdentities().data;

  const credentials = useCredentials();

  const data = usePopupData<ShareInput>();
  const { credentialRequest } = data;
  const { cTypes } = credentialRequest;
  const owner =
    'owner' in credentialRequest
      ? (credentialRequest.owner as DidUri)
      : undefined;
  const cTypeHashes = cTypes.map(({ cTypeHash }) => cTypeHash);

  const matchingCredentials = credentials?.filter(
    ({ credential: { claim } }) =>
      cTypeHashes.includes(claim.cTypeHash) &&
      (owner ? Did.isSameSubject(claim.owner, owner) : true),
  );

  const displayedCredentials = reject(matchingCredentials, {
    status: 'invalid',
  });

  const status = selected?.sporranCredential.status;

  const ref = useRef<HTMLElement>(null);

  const showConfirm = useBooleanState();

  const handleNext = useCallback(() => {
    history.push(paths.popup.share.sign);
  }, [history]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (status !== 'revoked') {
        handleNext();
        return;
      }
      showConfirm.on();
    },
    [status, handleNext, showConfirm],
  );

  if (!identities || !credentials) {
    return null; // storage data pending
  }

  const noDisplayedCredentials = displayedCredentials.length === 0;

  const matchingCredentialDids = displayedCredentials.map(
    ({ credential }) => parseDidUri(credential.claim.owner).fullDid,
  );
  const identitiesWithMatchingCredentials = Object.values(identities).filter(
    ({ did }) =>
      did && matchingCredentialDids.includes(parseDidUri(did).fullDid),
  );

  const sortedIdentities = sortBy(identitiesWithMatchingCredentials, 'index');

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>
        {t('view_ShareCredentialSelect_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_ShareCredentialSelect_subline')}
      </p>

      {noDisplayedCredentials && (
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

      {!noDisplayedCredentials && (
        <section className={styles.allCredentials} ref={ref}>
          {sortedIdentities.map((identity, index) => (
            <MatchingIdentityCredentials
              key={identity.address}
              identity={identity}
              onSelect={onSelect}
              selected={selected}
              allCredentials={displayedCredentials}
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
        <button
          type="submit"
          className={styles.next}
          disabled={!selected || status === 'pending' || status === 'rejected'}
        >
          {t('view_ShareCredentialSelect_next')}
        </button>
      </p>

      <Stats />

      {showConfirm.current && (
        <ConfirmModal onConfirm={handleNext} onReject={showConfirm.off} />
      )}
    </form>
  );
}
