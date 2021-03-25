import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

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
      <h2>{account.name}</h2>

      {!editing && (
        <button type="button" onClick={handleEditClick}>
          {t('component_AccountSlide_rename')}
        </button>
      )}

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
