import { useCallback } from 'react';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { paths } from '../../views/paths';
import { useAccounts } from '../../utilities/accounts/accounts';

import menuStyles from '../Menu/Menu.module.css';
import styles from './AddAccount.module.css';

export function AddAccount(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts().data;
  const hasAccounts = accounts && Object.values(accounts).length > 0;

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(2);

  const handleClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  if (!hasAccounts) {
    return null;
  }

  return (
    <div className={menuStyles.wrapper}>
      <button
        {...buttonProps}
        type="button"
        className={styles.toggle}
        title={t('component_AddAccount_label')}
        aria-label={t('component_AddAccount_label')}
      />

      {isOpen && (
        <div className={menuStyles.dropdown} role="menu" onClick={handleClick}>
          <h4 className={menuStyles.heading}>
            {t('component_AddAccount_label')}
          </h4>

          <ul className={menuStyles.list}>
            <li className={menuStyles.listItem}>
              <Link {...itemProps[0]} to={paths.account.create.start}>
                {t('component_AddAccount_create')}
              </Link>
            </li>

            <li className={menuStyles.listItem}>
              <Link {...itemProps[1]} to={paths.account.import.start}>
                {t('component_AddAccount_import')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
