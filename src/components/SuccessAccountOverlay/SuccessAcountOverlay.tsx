import { browser } from 'webextension-polyfill-ts';

import { Avatar } from '../Avatar/Avatar';
import { Account } from '../../utilities/accounts/accounts';

import styles from './SuccessAccountOverlay.module.css';

interface Props {
  account: Account;
  successType: 'created' | 'imported' | 'reset';
  closeOverlayHandler: () => void;
}

export function SuccessAccountOverlay({
  account,
  successType,
  closeOverlayHandler,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const messages = {
    created: t('component_CreateAccountSuccess_message_create'),
    imported: t('component_CreateAccountSuccess_message_import'),
    reset: t('component_CreateAccountSuccess_message_reset'),
  };

  return (
    <div className={styles.overlay}>
      <Avatar tartan={account.tartan} address={account.address} />
      <h1 className={styles.heading}>
        {t('component_CreateAccountSuccess_heading')}
      </h1>
      <p className={styles.text}>{messages[successType]}</p>
      <button
        type="button"
        className={styles.button}
        onClick={closeOverlayHandler}
      >
        {t('component_CreateAccountSuccess_button')}
      </button>
    </div>
  );
}
