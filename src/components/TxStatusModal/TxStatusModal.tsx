import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';
import { Link } from 'react-router-dom';

import { Account } from '../../utilities/accounts/types';
import { paths, generatePath } from '../../views/paths';

import { Avatar } from '../Avatar/Avatar';

import styles from './TxStatusModal.module.css';

interface Props {
  account: Account;
  pending: boolean;
}

export function TxStatusModal({ account, pending }: Props): JSX.Element {
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
      <Link
        className={styles.confirm}
        to={generatePath(paths.account.overview, { address: account.address })}
      >
        {t('common_action_confirm')}
      </Link>
    </Modal>
  );
}
