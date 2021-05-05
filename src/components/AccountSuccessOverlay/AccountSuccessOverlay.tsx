import { browser } from 'webextension-polyfill-ts';
import { Modal } from 'react-dialog-polyfill';

import { Avatar } from '../Avatar/Avatar';
import { Account } from '../../utilities/accounts/accounts';

import styles from './AccountSuccessOverlay.module.css';

interface Props {
  account: Account;
  successType: 'created' | 'imported' | 'reset';
  onSuccessOverlayButtonClick: () => void;
}

export function AccountSuccessOverlay({
  account,
  successType,
  onSuccessOverlayButtonClick,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const messages = {
    created: t('component_AccountSuccessOverlay_message_create'),
    imported: t('component_AccountSuccessOverlay_message_import'),
    reset: t('component_AccountSuccessOverlay_message_reset'),
  };

  return (
    <Modal open className={styles.overlay}>
      <Avatar tartan={account.tartan} address={account.address} />
      <h1 className={styles.heading}>
        {t('component_AccountSuccessOverlay_heading')}
      </h1>
      <p className={styles.text}>{messages[successType]}</p>
      <button
        type="button"
        className={styles.button}
        onClick={onSuccessOverlayButtonClick}
      >
        {t('component_AccountSuccessOverlay_button')}
      </button>
    </Modal>
  );
}
