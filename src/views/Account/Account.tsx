import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { Balance } from '../../components/Balance/Balance';
import {
  saveAccount,
  setCurrentAccount,
} from '../../utilities/accounts/accounts';
import { generatePath, paths } from '../paths';

interface Props {
  account: {
    address: string;
    name: string;
    index: number;
  };
}

export function Account({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  useEffect(() => {
    setCurrentAccount(account.address);
  }, [account]);

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
      <h2>{account.name}</h2>

      {!editing && (
        <button type="button" onClick={handleEditClick}>
          {t('view_Account_rename')}
        </button>
      )}

      {editing && (
        <form onSubmit={handleSubmit}>
          <label>
            {t('view_Account_name')}
            <input name="name" required />
          </label>
          <button type="submit">{t('common_action_save')}</button>

          <button type="button" onClick={handleCancelClick}>
            {t('common_action_cancel')}
          </button>
        </form>
      )}

      <p>
        <Balance address={account.address} />
      </p>

      <p>
        <Link to={generatePath(paths.account.send, account)}>
          {t('view_Account_send')}
        </Link>
      </p>
      <p>
        <Link to={generatePath(paths.account.receive, account)}>
          {t('view_Account_receive')}
        </Link>
      </p>
    </section>
  );
}
