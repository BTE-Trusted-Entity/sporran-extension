import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { AccountOptions } from '../AccountOptions/AccountOptions';
import { Account, saveAccount } from '../../utilities/accounts/accounts';
import { Avatar } from '../Avatar/Avatar';

import styles from './AccountSlide.module.css';

interface Props {
  account: Account;
}

export function AccountSlide({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [editing, setEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditing(false);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const name = event.target.elements.name.value;
      await saveAccount({
        ...account,
        name,
      });

      setEditing(false);
    },
    [account],
  );

  return (
    <section>
      <Avatar tartan={account.tartan} address={account.address} />
      <div className={styles.slideInfo}>
        <div className={styles.nameContainer}>
          <h2 className={styles.name}>{account.name}</h2>
          <AccountOptions address={account.address} onEdit={handleEditClick} />
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSubmit}>
          <label>
            {t('component_AccountSlide_name')}
            <input name="name" required />
          </label>
          <button type="submit">{t('common_action_save')}</button>

          <button type="button" onClick={handleCancelClick}>
            {t('common_action_cancel')}
          </button>
        </form>
      )}
    </section>
  );
}
