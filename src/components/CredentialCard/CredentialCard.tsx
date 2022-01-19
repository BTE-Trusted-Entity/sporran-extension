import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
} from 'react';
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
  getShowDownloadInfo,
  setShowDownloadInfo,
} from '../../utilities/showDownloadInfoStorage/showDownloadInfoStorage';

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

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.target.blur();
    }
  }, []);

  const handleBlur = useCallback(
    async (event) => {
      const name = event.target.value;
      if (name) {
        await saveCredential({ ...credential, name });
      }
      setIsEditing(false);
    },
    [credential],
  );

  return isEditing ? (
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
          onClick={handleEditClick}
        />
      </dd>
    </div>
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
  const { status } = credential;

  const [expanded, setExpanded] = useState(expand);

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);
  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  const contents = Object.entries(credential.request.claim.contents);

  const download = getCredentialDownload(credential);
  const downloadLink = useRef<HTMLAnchorElement>(null);

  const cardRef = useRef<HTMLLIElement>(null);

  useScrollIntoView(expanded, cardRef);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteClick = useCallback(() => setDeleteModalOpen(true), []);

  const handleDeleteConfirm = useCallback(async () => {
    await deleteCredential(credential);
    setDeleteModalOpen(false);
  }, [credential]);

  const handleDeleteCancel = useCallback(() => setDeleteModalOpen(false), []);

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const handleDownloadClick = useCallback(async () => {
    const showDownloadModal = await getShowDownloadInfo();

    if (credential.isDownloaded || !showDownloadModal) {
      downloadLink.current?.click();
      await saveCredential({ ...credential, isDownloaded: true });
    } else {
      setDownloadModalOpen(true);
    }
  }, [credential]);

  const [checked, setChecked] = useState(false);

  const handleToggle = useCallback((event) => {
    setChecked(event.target.checked);
  }, []);

  const handleDownloadConfirm = useCallback(async () => {
    downloadLink.current?.click();
    await saveCredential({ ...credential, isDownloaded: true });
    await setShowDownloadInfo(!checked);
    setDownloadModalOpen(false);
  }, [credential, checked]);

  const handleDownloadCancel = useCallback(
    () => setDownloadModalOpen(false),
    [],
  );

  return (
    <li className={styles.credential} aria-expanded={expanded} ref={cardRef}>
      {!expanded && (
        <button
          type="button"
          className={
            credential.isDownloaded ? styles.expand : styles.downloadPrompt
          }
          onClick={handleExpand}
          aria-label={
            !credential.isDownloaded
              ? `${credential.name} ${contents[0][1]} ${t(
                  'component_CredentialCard_download_prompt',
                )}`
              : undefined
          }
        >
          <section className={styles.collapsedCredential}>
            <h4 className={styles.collapsedName}>{credential.name}</h4>
            <p className={styles.collapsedValue}>{contents[0][1]}</p>
          </section>
        </button>
      )}
      {expanded && (
        <section className={styles.expanded}>
          <section className={styles.buttons}>
            {collapsible && (
              <button
                type="button"
                aria-label={t('component_CredentialCard_collapse')}
                className={styles.collapse}
                onClick={handleCollapse}
              />
            )}
            {buttons && (
              <Fragment>
                <a
                  download={download.name}
                  href={download.url}
                  ref={downloadLink}
                  hidden
                />
                <button
                  aria-label={t('component_CredentialCard_backup')}
                  className={
                    credential.isDownloaded
                      ? styles.download
                      : styles.downloadPromptExpanded
                  }
                  onClick={handleDownloadClick}
                />
                <button
                  type="button"
                  aria-label={t('component_CredentialCard_remove')}
                  className={styles.remove}
                  onClick={handleDeleteClick}
                />
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
              <dd className={styles.detailValue}>
                {credential.request.rootHash}
              </dd>
            </div>
          </dl>
        </section>
      )}

      {deleteModalOpen && (
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
            onClick={handleDeleteCancel}
          >
            {t('common_action_cancel')}
          </button>
          <button
            type="button"
            className={styles.confirmDelete}
            onClick={handleDeleteConfirm}
          >
            {t('component_CredentialCard_delete_confirm')}
          </button>
        </Modal>
      )}

      {downloadModalOpen && (
        <Modal open className={styles.overlay}>
          <h2 className={styles.downloadInfo}>
            {t('component_CredentialCard_download_info')}
          </h2>
          <button
            type="button"
            className={styles.confirmDownload}
            onClick={handleDownloadConfirm}
          >
            {t('component_CredentialCard_download_confirm')}
          </button>
          <button
            type="button"
            className={styles.cancelDownload}
            onClick={handleDownloadCancel}
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
        </Modal>
      )}
    </li>
  );
}
