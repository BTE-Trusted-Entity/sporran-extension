import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { AccountOptions } from '../AccountOptions/AccountOptions';
import { saveAccount } from '../../utilities/accounts/accounts';

interface Props {
  account: {
    address: string;
    name: string;
    index: number;
  };
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
      <h2 style={{ display: 'inline' }}>{account.name}</h2>
      <AccountOptions address={account.address} onEdit={handleEditClick} />

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
