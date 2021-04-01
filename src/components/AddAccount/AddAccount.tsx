import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { paths } from '../../views/paths';
import { useAccounts } from '../../utilities/accounts/accounts';

import styles from './AddAccount.module.css';

export function AddAccount(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts().data;
  const hasAccounts = accounts && Object.values(accounts).length > 0;

  const { buttonProps, itemProps, isOpen } = useDropdownMenu(2);

  if (!hasAccounts) {
    return null;
  }

  return (
    <nav className={styles.container}>
      <button
        {...buttonProps}
        type="button"
        className={styles.button}
        title={t('component_AddAccount_label')}
        aria-label={t('component_AddAccount_label')}
      >
        +
      </button>
      {isOpen && (
        <div className={styles.menu} role="menu">
          <h4 className={styles.menuHeading}>
            {t('component_AddAccount_label')}
          </h4>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <Link {...itemProps[0]} to={paths.account.create.start}>
                {t('component_AddAccount_create')}
              </Link>
            </li>
            <li className={styles.listItem}>
              <Link {...itemProps[1]} to={paths.account.import.start}>
                {t('component_AddAccount_import')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
