import { JSX, ReactNode } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';
import { Link } from 'react-router-dom';

import * as styles from './TxStatusModal.module.css';

import { Identity } from '../../utilities/identities/types';
import { paths, generatePath } from '../../views/paths';
import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';
import { Avatar } from '../Avatar/Avatar';

interface Messages {
  pending: ReactNode;
  success: ReactNode;
  error: ReactNode;
}

interface Props {
  identity: Identity;
  status: 'pending' | 'success' | 'error';
  txHash?: string;
  onDismissError: () => void;
  messages?: Messages;
  destination?: string;
}

const t = browser.i18n.getMessage;
const defaultMessages: Messages = {
  pending: t('component_TxStatusModal_pending'),
  success: t('component_TxStatusModal_success'),
  error: t('component_TxStatusModal_error'),
};

export function TxStatusModal({
  identity,
  status,
  txHash,
  onDismissError,
  messages = defaultMessages,
  destination,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const subscanHost = useSubscanHost();
  const subscanLink = subscanHost && txHash && (
    <a
      className={styles.subscan}
      href={`${subscanHost}/extrinsic/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {t('component_TxStatusModal_subscan')}
    </a>
  );

  const finalDestination =
    destination ||
    generatePath(paths.identity.overview, { address: identity.address });

  const modals = {
    pending: (
      <Modal open className={styles.overlay}>
        <Avatar identity={identity} className={styles.transparent} />
        <h1 className={styles.heading}>{messages[status]}</h1>
        <Link className={styles.confirm} to={finalDestination}>
          {t('common_action_confirm')}
        </Link>
        {subscanLink}
      </Modal>
    ),
    success: (
      <Modal open className={styles.overlay}>
        <div className={styles.success}>
          <Avatar identity={identity} className={styles.transparent} />
        </div>
        <h1 className={styles.heading}>{messages[status]}</h1>
        <Link className={styles.confirm} to={finalDestination}>
          {t('common_action_confirm')}
        </Link>
        {subscanLink}
      </Modal>
    ),
    error: (
      <Modal open className={styles.overlay}>
        <div className={styles.error}>
          <Avatar identity={identity} className={styles.transparent} />
        </div>
        <h1 className={styles.heading}>{messages[status]}</h1>
        <button className={styles.confirm} onClick={onDismissError}>
          {t('common_action_confirm')}
        </button>
        <a
          className={styles.status}
          href="https://status.kilt.io/"
          target="_blank"
          rel="noreferrer"
        >
          {t('component_TxStatusModal_status')}
        </a>
      </Modal>
    ),
  };

  return modals[status] || null;
}
