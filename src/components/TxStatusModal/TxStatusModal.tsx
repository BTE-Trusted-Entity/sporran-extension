import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';
import { Link } from 'react-router-dom';

import { Account } from '../../utilities/accounts/types';
import { paths, generatePath } from '../../views/paths';

import { Avatar } from '../Avatar/Avatar';

import styles from './TxStatusModal.module.css';

interface Props {
  account: Account;
  status: 'pending' | 'success' | 'error';
  onClose: () => void;
}

export function TxStatusModal({
  account,
  status,
  onClose,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  switch (status) {
    case 'pending':
      return (
        <Modal open className={styles.overlay}>
          <Avatar
            tartan={account.tartan}
            address={account.address}
            className={styles.transparent}
          />
          <h1 className={styles.heading}>
            {t('component_TxStatusModal_pending')}
          </h1>
          <Link
            className={styles.confirm}
            to={generatePath(paths.account.overview, {
              address: account.address,
            })}
          >
            {t('common_action_confirm')}
          </Link>
        </Modal>
      );
    case 'success':
      return (
        <Modal open className={styles.overlay}>
          <div className={styles.success}>
            <Avatar
              tartan={account.tartan}
              address={account.address}
              className={styles.transparent}
            />
          </div>
          <h1 className={styles.heading}>
            {t('component_TxStatusModal_success')}
          </h1>
          <Link
            className={styles.confirm}
            to={generatePath(paths.account.overview, {
              address: account.address,
            })}
          >
            {t('common_action_confirm')}
          </Link>
        </Modal>
      );
    case 'error':
      return (
        <Modal open className={styles.overlay}>
          <div className={styles.error}>
            <Avatar
              tartan={account.tartan}
              address={account.address}
              className={styles.transparent}
            />
          </div>
          <h1 className={styles.heading}>
            {t('component_TxStatusModal_error')}
          </h1>
          <button className={styles.confirm} onClick={onClose}>
            {t('common_action_confirm')}
          </button>
        </Modal>
      );
    default:
      return null;
  }
}
