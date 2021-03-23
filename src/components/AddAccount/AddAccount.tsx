import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import styles from './AddAccount.module.css';
import { paths } from '../../views/paths';

export function AddAccount(): JSX.Element {
  const t = browser.i18n.getMessage;

  const { buttonProps, itemProps, isOpen } = useDropdownMenu(2);

  return (
    <nav className={styles.container}>
      <button {...buttonProps} type="button" className={styles.button}>
        +
      </button>
      <div
        className={cx(styles.menu, {
          [styles.visible]: isOpen,
          [styles.invisible]: !isOpen,
        })}
        role="menu"
      >
        <h4 className={cx(styles.menuItem, styles.menuTitle)}>
          {t('component_AddAccount_title')}
        </h4>
        <Link
          {...itemProps[0]}
          to={paths.account.create.start}
          className={cx(styles.menuItem, styles.menuLink)}
        >
          {t('component_AddAccount_create')}
        </Link>
        <Link
          {...itemProps[1]}
          to={paths.account.import.start}
          className={cx(styles.menuItem, styles.menuLink)}
        >
          {t('component_AddAccount_import')}
        </Link>
      </div>
    </nav>
  );
}
