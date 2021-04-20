import { SuccessTypes } from '../../utilities/accounts/types';
import { Avatar } from '../Avatar/Avatar';
import { Account } from '../../utilities/accounts/accounts';
import styles from './SuccessAccountOverlay.module.css';
import { browser } from 'webextension-polyfill-ts';
import { useState } from 'react';

interface Props {
  account: Account;
  successType: SuccessTypes;
}

const t = browser.i18n.getMessage;

const SuccessSwitch = (type: SuccessTypes) => {
  switch (type) {
    case SuccessTypes.created:
      return t('component_CreateAccountSuccess_message_create');
    case SuccessTypes.imported:
      return t('component_CreateAccountSuccess_message_import');
    case SuccessTypes.reset:
      return t('component_CreateAccountSuccess_message_reset');
  }
};

export const SuccessAccountOverlay = ({
  account,
  successType,
}: Props): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(true);

  const okHandler = () => setIsOpen(false);

  return isOpen ? (
    <div className={styles.container}>
      <Avatar tartan={account.tartan} address={account.address} />
      <h1 className={styles.heading}>
        {t('component_CreateAccountSuccess_heading')}
      </h1>
      <p className={styles.text}>{SuccessSwitch(successType)}</p>
      <button type="button" className={styles.button} onClick={okHandler}>
        {t('component_CreateAccountSuccess_button')}
      </button>
    </div>
  ) : null;
};
