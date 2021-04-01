import { useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import styles from './AccountOptions.module.css';

interface Props {
  onEdit: () => void;
}

export function AccountOptions({ onEdit }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(3);

  const handleClick = useCallback(() => {
    onEdit();
    setIsOpen(false);
  }, [onEdit, setIsOpen]);

  return (
    <nav className={styles.container}>
      <button
        {...buttonProps}
        type="button"
        title={t('component_AccountOptions_label')}
        aria-label={t('component_AccountOptions_label')}
        className={styles.button}
      >
        v
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu">
          <h4 className={styles.menuHeading}>
            {t('component_AccountOptions_heading')}
          </h4>

          <ul className={styles.list}>
            <li className={styles.listItem}>
              <button
                type="button"
                {...(itemProps[0] as unknown)}
                onClick={handleClick}
              >
                {t('component_AccountOptions_edit')}
              </button>
            </li>
            <li className={styles.listItem}>
              {/* TODO: forget account - https://kiltprotocol.atlassian.net/browse/SK-59 */}
              <a {...itemProps[1]}>{t('component_AccountOptions_forget')}</a>
            </li>
            <li className={styles.listItem}>
              {/* TODO: reset password - https://kiltprotocol.atlassian.net/browse/SK-55 */}
              <a {...itemProps[2]}>
                {t('component_AccountOptions_reset_password')}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
