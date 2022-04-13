import {
  FormEvent,
  Fragment,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import { Modal } from 'react-dialog-polyfill';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './CredentialCard.module.css';

import {
  Credential,
  deleteCredential,
  getCredentialDownload,
  saveCredential,
  usePendingCredentialCheck,
} from '../../utilities/credentials/credentials';
import {
  setShowDownloadInfo,
  useShowDownloadInfo,
} from '../../utilities/showDownloadInfoStorage/showDownloadInfoStorage';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';
import {
  setShowPresentationInfo,
  useShowPresentationInfo,
} from '../../utilities/showPresentationInfoStorage/showPresentationInfoStorage';
import { isFullDid } from '../../utilities/did/did';
import { generatePath, paths } from '../../views/paths';

export function useScrollIntoView(
  expanded: boolean,
  cardRef: RefObject<HTMLLIElement>,
  isContainerParent = true,
): void {
  useEffect(() => {
    const containerElement = isContainerParent
      ? cardRef.current?.parentElement
      : document.getElementById('allCredentials');

    if (expanded && cardRef.current && containerElement) {
      const card = cardRef.current.getBoundingClientRect();
      const container = containerElement.getBoundingClientRect();

      const isCardOverflowing = card.bottom > container.bottom;

      if (!isCardOverflowing) {
        return;
      }

      if (card.height < container.height) {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [expanded, cardRef, isContainerParent]);
}

function CredentialName({
  credential,
}: {
  credential: Credential;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const isEditing = useBooleanState();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }, []);

  const handleBlur = useCallback(
    async (event: FormEvent<HTMLInputElement>) => {
      const name = (event.target as HTMLInputElement).value;
      if (name) {
        await saveCredential({ ...credential, name });
      }
      isEditing.off();
    },
    [credential, isEditing],
  );

  return isEditing.current ? (
    <div className={styles.detail}>
      <label className={styles.detailName}>
        {t('component_CredentialCard_name')}
        <input
          defaultValue={credential.name}
          autoFocus
          className={styles.input}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
        />
      </label>
    </div>
  ) : (
    <div className={styles.detail}>
      <dt className={styles.detailName}>
        {t('component_CredentialCard_name')}
      </dt>
      <dd className={styles.nameValue}>
        {credential.name}
        <button
          className={styles.editName}
          aria-label={t('component_CredentialCard_edit_name')}
          onClick={isEditing.on}
        />
      </dd>
    </div>
  );
}

function DeleteModal({
  credential,
  portalRef,
}: {
  credential: Credential;
  portalRef: RefObject<HTMLElement>;
}) {
  const t = browser.i18n.getMessage;

  const visibility = useBooleanState();

  const handleConfirm = useCallback(async () => {
    await deleteCredential(credential);
    visibility.off();
  }, [credential, visibility]);

  return (
    <Fragment>
      <button
        type="button"
        aria-label={t('component_CredentialCard_remove')}
        className={styles.remove}
        onClick={visibility.on}
      />

      {visibility.current &&
        portalRef.current &&
        createPortal(
          <Modal open className={styles.overlay}>
            <h1 className={styles.warning}>
              {t('component_CredentialCard_delete_warning')}
            </h1>
            <p className={styles.explanation}>
              {t('component_CredentialCard_delete_explanation')}
            </p>
            <button
              type="button"
              className={styles.cancelDelete}
              onClick={visibility.off}
            >
              {t('common_action_cancel')}
            </button>
            <button
              type="button"
              className={styles.confirmDelete}
              onClick={handleConfirm}
            >
              {t('component_CredentialCard_delete_confirm')}
            </button>
          </Modal>,
          portalRef.current,
        )}
    </Fragment>
  );
}

function DownloadModal({
  credential,
  portalRef,
}: {
  credential: Credential;
  portalRef: RefObject<HTMLElement>;
}) {
  const t = browser.i18n.getMessage;
  const visibility = useBooleanState();

  const markCredentialDownloaded = useCallback(async () => {
    await saveCredential({ ...credential, isDownloaded: true });
  }, [credential]);

  const [checked, setChecked] = useState(false);

  const handleToggle = useCallback((event: FormEvent<HTMLInputElement>) => {
    setChecked((event.target as HTMLInputElement).checked);
  }, []);

  const handleConfirm = useCallback(async () => {
    await markCredentialDownloaded();
    await setShowDownloadInfo(!checked);
    visibility.off();
  }, [markCredentialDownloaded, checked, visibility]);

  const showInfo = useShowDownloadInfo();
  const { isDownloaded } = credential;
  const { name, url } = getCredentialDownload(credential);

  return (
    <Fragment>
      {!isDownloaded && showInfo ? (
        <button
          className={
            isDownloaded ? styles.download : styles.downloadPromptExpanded
          }
          aria-label={t('component_CredentialCard_backup')}
          onClick={visibility.on}
        />
      ) : (
        <a
          download={name}
          href={url}
          aria-label={t('component_CredentialCard_backup')}
          className={
            isDownloaded ? styles.download : styles.downloadPromptExpanded
          }
          onClick={markCredentialDownloaded}
        />
      )}

      {visibility.current &&
        portalRef.current &&
        createPortal(
          <Modal open className={styles.overlay}>
            <h2 className={styles.downloadInfo}>
              {t('component_CredentialCard_download_info')}
            </h2>
            <a
              download={name}
              href={url}
              className={styles.confirmDownload}
              onClick={handleConfirm}
            >
              {t('component_CredentialCard_download_confirm')}
            </a>
            <button
              type="button"
              className={styles.cancelDownload}
              onClick={visibility.off}
            >
              {t('common_action_close')}
            </button>
            <label className={styles.toggleLabel}>
              {t('component_CredentialCard_download_toggle')}
              <input
                className={styles.toggle}
                type="checkbox"
                defaultChecked={false}
                onClick={handleToggle}
              />
              <span />
            </label>
          </Modal>,
          portalRef.current,
        )}
    </Fragment>
  );
}

function PresentationModal({
  credential,
  portalRef,
}: {
  credential: Credential;
  portalRef: RefObject<HTMLElement>;
}) {
  const t = browser.i18n.getMessage;
  const visibility = useBooleanState();

  const [checked, setChecked] = useState(false);

  const handleToggle = useCallback((event: FormEvent<HTMLInputElement>) => {
    setChecked((event.target as HTMLInputElement).checked);
  }, []);

  const handleConfirm = useCallback(async () => {
    await setShowPresentationInfo(!checked);
    visibility.off();
  }, [checked, visibility]);

  const showInfo = useShowPresentationInfo();

  const isAttested = credential.status === 'attested';
  const { address } = useParams() as { address: string };
  if (!address || !isAttested) {
    return null; // only allow creating presentation when the identity is known and the credential is attested
  }

  const hash = credential.request.rootHash;
  const url = generatePath(paths.identity.credentials.presentation, {
    address,
    hash,
  });

  return (
    <Fragment>
      {showInfo ? (
        <button
          className={styles.presentation}
          aria-label={t('component_CredentialCard_presentation')}
          onClick={visibility.on}
        />
      ) : (
        <Link
          to={url}
          aria-label={t('component_CredentialCard_presentation')}
          className={styles.presentation}
        />
      )}

      {visibility.current &&
        portalRef.current &&
        createPortal(
          <Modal open className={styles.overlay}>
            <h2 className={styles.downloadInfo}>
              {t('component_CredentialCard_presentation_info')}
            </h2>
            <Link
              to={url}
              className={styles.confirmDownload}
              onClick={handleConfirm}
            >
              {t('component_CredentialCard_presentation_confirm')}
            </Link>
            <p className={styles.buttonsLine}>
              <a
                href="https://support.kilt.io/support/solutions/articles/80000987961"
                target="_blank"
                rel="noreferrer"
                className={styles.learnMore}
              >
                {t('component_CredentialCard_more')}
              </a>
              <button
                type="button"
                className={styles.cancelDownload}
                onClick={visibility.off}
              >
                {t('common_action_close')}
              </button>
            </p>
            <label className={styles.toggleLabel}>
              {t('component_CredentialCard_presentation_toggle')}
              <input
                className={styles.toggle}
                type="checkbox"
                defaultChecked={false}
                onClick={handleToggle}
              />
              <span />
            </label>
          </Modal>,
          portalRef.current,
        )}
    </Fragment>
  );
}

interface Props {
  credential: Credential;
  expand?: boolean;
  collapsible?: boolean;
  buttons?: boolean;
}

export function CredentialCard({
  credential,
  expand = false,
  collapsible = true,
  buttons = true,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const statuses = {
    pending: t('component_CredentialCard_pending'),
    attested: t('component_CredentialCard_attested'),
    revoked: t('component_CredentialCard_revoked'),
    invalid: t('component_CredentialCard_invalid'),
  };

  usePendingCredentialCheck(credential);

  const expanded = useBooleanState(expand);

  const cardRef = useRef<HTMLLIElement>(null);
  useScrollIntoView(expanded.current, cardRef);

  const portalRef = useRef<HTMLDivElement>(null);

  const { status, isDownloaded, request, name } = credential;
  const contents = Object.entries(request.claim.contents);
  const label = contents[0][1];

  return (
    <li
      className={styles.credential}
      aria-expanded={expanded.current}
      ref={cardRef}
    >
      {!expanded.current && (
        <button
          type="button"
          className={isDownloaded ? styles.expand : styles.downloadPrompt}
          onClick={expanded.on}
          aria-label={
            !isDownloaded
              ? `${name} ${label} ${t(
                  'component_CredentialCard_download_prompt',
                )}`
              : undefined
          }
        >
          <section className={styles.collapsedCredential}>
            <h4 className={styles.collapsedName}>{name}</h4>
            <p className={styles.collapsedValue}>{label}</p>
          </section>
        </button>
      )}
      {expanded.current && (
        <section className={styles.expanded}>
          <section className={styles.buttons}>
            {collapsible && (
              <button
                type="button"
                aria-label={t('component_CredentialCard_collapse')}
                className={styles.collapse}
                onClick={expanded.off}
              />
            )}
            {buttons && (
              <Fragment>
                <DownloadModal credential={credential} portalRef={portalRef} />

                {isFullDid(request.claim.owner) && (
                  <PresentationModal
                    credential={credential}
                    portalRef={portalRef}
                  />
                )}

                <DeleteModal credential={credential} portalRef={portalRef} />
              </Fragment>
            )}
          </section>

          <dl className={styles.details}>
            <CredentialName credential={credential} />

            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_status')}
              </dt>
              <dd className={styles.detailValue}>{statuses[status]}</dd>
            </div>

            {contents.map(([name, value]) => (
              <div key={name} className={styles.detail}>
                <dt className={styles.detailName}>{name}</dt>
                <dd className={styles.detailValue}>{value}</dd>
              </div>
            ))}
          </dl>

          <h4 className={styles.technical}>
            {t('component_CredentialCard_technical')}
          </h4>

          <dl className={styles.details}>
            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_ctype')}
              </dt>
              <dd className={styles.detailValue}>{credential.cTypeTitle}</dd>
            </div>
            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_attester')}
              </dt>
              <dd className={styles.detailValue}>{credential.attester}</dd>
            </div>
            <div className={styles.hash}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_hash')}
              </dt>
              <dd className={styles.detailValue}>{request.rootHash}</dd>
            </div>
          </dl>
        </section>
      )}

      <div ref={portalRef} />
    </li>
  );
}
