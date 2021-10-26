import { ReactNode } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';
import { Link } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths, generatePath } from '../../views/paths';
import { useConfiguration } from '../../configuration/useConfiguration';
import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';
import { Avatar } from '../Avatar/Avatar';

import * as styles from './TxStatusModal.module.css';

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
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { features } = useConfiguration();

  const subscanHost = useSubscanHost();
  const subscanLink = features.subscan && subscanHost && txHash && (
    <a
      className={styles.subscan}
      href={`${subscanHost}/extrinsic/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {t('component_TxStatusModal_subscan')}
    </a>
  );

  const modals = {
    pending: (
      <Modal open className={styles.overlay}>
        <Avatar identity={identity} className={styles.transparent} />
        <h1 className={styles.heading}>{messages[status]}</h1>
        <Link
          className={styles.confirm}
          to={generatePath(paths.identity.overview, {
            address: identity.address,
          })}
        >
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
        <Link
          className={styles.confirm}
          to={generatePath(paths.identity.overview, {
            address: identity.address,
          })}
        >
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
        {subscanLink}
      </Modal>
    ),
  };

  return modals[status] || null;
}
