import { browser } from 'webextension-polyfill-ts';

import { Avatar } from '../Avatar/Avatar';
import { SuccessTypes } from '../../utilities/accounts/types';
import { Account } from '../../utilities/accounts/accounts';

import styles from './SuccessAccountOverlay.module.css';

interface Props {
  account: Account;
  successType: SuccessTypes;
  openOverlayHandler: () => void;
}

const t = browser.i18n.getMessage;

function SuccessSwitch(type: SuccessTypes) {
  switch (type) {
    case SuccessTypes.created:
      return t('component_CreateAccountSuccess_message_create');
    case SuccessTypes.imported:
      return t('component_CreateAccountSuccess_message_import');
    case SuccessTypes.reset:
      return t('component_CreateAccountSuccess_message_reset');
    default:
      null;
  }
}

export function SuccessAccountOverlay({
  account,
  successType,
  openOverlayHandler,
}: Props): JSX.Element | null {
  return (
    <div className={styles.container}>
      <Avatar tartan={account.tartan} address={account.address} />
      <h1 className={styles.heading}>
        {t('component_CreateAccountSuccess_heading')}
      </h1>
      <p className={styles.text}>{SuccessSwitch(successType)}</p>
      <button
        type="button"
        className={styles.button}
        onClick={openOverlayHandler}
      >
        {t('component_CreateAccountSuccess_button')}
      </button>
    </div>
  );
}
