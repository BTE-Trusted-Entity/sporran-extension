import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import { generatePath, paths } from '../../views/paths';

import menuStyles from '../Menu/Menu.module.css';
import styles from './AccountOptions.module.css';

interface Props {
  address: string;
  onEdit: () => void;
}

export function AccountOptions({ address, onEdit }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(3);

  const handleClick = useCallback(() => {
    onEdit();
    setIsOpen(false);
  }, [onEdit, setIsOpen]);

  return (
    <div className={styles.wrapper}>
      <button
        {...buttonProps}
        type="button"
        title={t('component_AccountOptions_label')}
        aria-label={t('component_AccountOptions_label')}
        className={styles.toggle}
      />

      {isOpen && (
        <div className={menuStyles.dropdown} role="menu">
          <h4 className={styles.heading}>
            {t('component_AccountOptions_heading')}
          </h4>

          <ul className={menuStyles.list}>
            <li className={menuStyles.listItem}>
              <button
                type="button"
                {...(itemProps[0] as unknown)}
                onClick={handleClick}
                className={menuStyles.listButton}
              >
                {t('component_AccountOptions_edit')}
              </button>
            </li>
            <li className={menuStyles.listItem}>
              <Link
                to={generatePath(paths.account.remove, { address })}
                {...itemProps[1]}
              >
                {t('component_AccountOptions_forget')}
              </Link>
            </li>
            <li className={menuStyles.listItem}>
              <Link
                to={generatePath(paths.account.reset.start, { address })}
                {...itemProps[2]}
              >
                {t('component_AccountOptions_reset_password')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
