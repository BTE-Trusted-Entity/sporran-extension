import { browser } from 'webextension-polyfill-ts';

import { Avatar } from '../Avatar/Avatar';
import { Account } from '../../utilities/accounts/accounts';

import styles from './AccountSuccessOverlay.module.css';

interface Props {
  account: Account;
  successType: 'created' | 'imported' | 'reset';
  handleSuccessOverlayButtonClick: () => void;
}

export function AccountSuccessOverlay({
  account,
  successType,
  handleSuccessOverlayButtonClick,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const messages = {
    created: t('component_SuccessAccountOverlay_message_create'),
    imported: t('component_SuccessAccountOverlay_message_import'),
    reset: t('component_SuccessAccountOverlay_message_reset'),
  };

  return (
    <div className={styles.overlay}>
      <Avatar tartan={account.tartan} address={account.address} />
      <h1 className={styles.heading}>
        {t('component_SuccessAccountOverlay_heading')}
      </h1>
      <p className={styles.text}>{messages[successType]}</p>
      <button
        type="button"
        className={styles.button}
        onClick={handleSuccessOverlayButtonClick}
      >
        {t('component_SuccessAccountOverlay_button')}
      </button>
    </div>
  );
}
