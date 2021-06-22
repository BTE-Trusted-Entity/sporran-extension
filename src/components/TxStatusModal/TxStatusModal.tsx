import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';
import { Link } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths, generatePath } from '../../views/paths';

import { Avatar } from '../Avatar/Avatar';

import styles from './TxStatusModal.module.css';

interface Props {
  identity: Identity;
  status: 'pending' | 'success' | 'error';
  onDismissError: () => void;
}

export function TxStatusModal({
  identity,
  status,
  onDismissError,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const modals = {
    pending: (
      <Modal open className={styles.overlay}>
        <Avatar address={identity.address} className={styles.transparent} />
        <h1 className={styles.heading}>
          {t('component_TxStatusModal_pending')}
        </h1>
        <Link
          className={styles.confirm}
          to={generatePath(paths.identity.overview, {
            address: identity.address,
          })}
        >
          {t('common_action_confirm')}
        </Link>
      </Modal>
    ),
    success: (
      <Modal open className={styles.overlay}>
        <div className={styles.success}>
          <Avatar address={identity.address} className={styles.transparent} />
        </div>
        <h1 className={styles.heading}>
          {t('component_TxStatusModal_success')}
        </h1>
        <Link
          className={styles.confirm}
          to={generatePath(paths.identity.overview, {
            address: identity.address,
          })}
        >
          {t('common_action_confirm')}
        </Link>
      </Modal>
    ),
    error: (
      <Modal open className={styles.overlay}>
        <div className={styles.error}>
          <Avatar address={identity.address} className={styles.transparent} />
        </div>
        <h1 className={styles.heading}>{t('component_TxStatusModal_error')}</h1>
        <button className={styles.confirm} onClick={onDismissError}>
          {t('common_action_confirm')}
        </button>
      </Modal>
    ),
  };

  return modals[status] || null;
}
