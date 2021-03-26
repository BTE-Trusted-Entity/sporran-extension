import { useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import cx from 'classnames';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import styles from './AccountOptions.module.css';

interface Props {
  onEdit: () => void;
}

export function AccountOptions({ onEdit }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(3);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      onEdit();
      setIsOpen(false);
    },
    [onEdit, setIsOpen],
  );

  return (
    <nav className={styles.container}>
      <button
        {...buttonProps}
        type="button"
        aria-label="open account options menu"
        className={styles.button}
      >
        v
      </button>

      <div
        className={cx(styles.menu, {
          [styles.hidden]: !isOpen,
        })}
        role="menu"
      >
        <h4 className={styles.menuTitle}>
          {t('component_AccountOptions_title')}
        </h4>

        <ul className={styles.list}>
          <li className={styles.listItem}>
            <a {...itemProps[0]} onClick={handleClick}>
              {t('component_AccountOptions_edit')}
            </a>
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
    </nav>
  );
}
