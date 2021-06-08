import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';

import { Account } from '../../utilities/accounts/types';

import { Avatar } from '../Avatar/Avatar';

import styles from './TxStatusModal.module.css';

interface Props {
  account: Account;
  pending: boolean;
  handleClose: () => void;
}

export function TxStatusModal({
  account,
  pending,
  handleClose,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  return (
    <Modal open className={styles.overlay}>
      {pending ? (
        <Avatar
          tartan={account.tartan}
          address={account.address}
          className={styles.transparent}
        />
      ) : (
        <div className={styles.wrapper}>
          <Avatar
            tartan={account.tartan}
            address={account.address}
            className={styles.transparent}
          />
        </div>
      )}
      {pending ? (
        <h1 className={styles.heading}>
          {t('component_TxStatusModal_pending')}
        </h1>
      ) : (
        <h1 className={styles.heading}>
          {t('component_TxStatusModal_success')}
        </h1>
      )}
      <button type="button" onClick={handleClose} className={styles.confirm}>
        {t('common_action_confirm')}
      </button>
    </Modal>
  );
}
