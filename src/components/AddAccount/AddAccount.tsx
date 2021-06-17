import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { paths } from '../../views/paths';
import { useAccounts } from '../../utilities/accounts/accounts';

import styles from './AddAccount.module.css';

export function AddAccount(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts().data;
  const hasAccounts = accounts && Object.values(accounts).length > 0;

  if (!hasAccounts) {
    return null;
  }

  return (
    <Link
      className={styles.toggle}
      to={paths.account.add}
      title={t('component_AddAccount_label')}
      aria-label={t('component_AddAccount_label')}
    />
  );
}
