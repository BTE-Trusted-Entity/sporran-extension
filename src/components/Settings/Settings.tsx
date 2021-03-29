import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import cx from 'classnames';

import { AccountsMap } from '../../utilities/accounts/accounts';

import styles from './Settings.module.css';

export interface Props {
  accounts?: AccountsMap;
}

export function Settings({ accounts }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { buttonProps, itemProps, isOpen } = useDropdownMenu(accounts ? 4 : 2);

  // TODO - move version number to config
  const VERSION_NUMBER = '1.0.0';

  return (
    <nav className={styles.container}>
      <button
        {...buttonProps}
        type="button"
        className={styles.button}
        title={t('component_Settings_label')}
        aria-label={t('component_Settings_label')}
      >
        ⚙
      </button>

      {isOpen && (
        <div
          className={cx(styles.menu, {
            [styles.hidden]: !isOpen,
          })}
          role="menu"
        >
          <h4 className={styles.menuHeading}>
            {t('component_Settings_label')}
          </h4>

          <ul className={styles.list}>
            {accounts && (
              <li className={styles.listItem}>
                {/* TODO: forget account - https://kiltprotocol.atlassian.net/browse/SK-59 */}
                <a {...itemProps[0]}>{t('component_Settings_forget')}</a>
              </li>
            )}
            {accounts && (
              <li className={styles.listItem}>
                {/* TODO: reset password - https://kiltprotocol.atlassian.net/browse/SK-55 */}
                <a {...itemProps[1]}>
                  {t('component_Settings_reset_password')}
                </a>
              </li>
            )}
            <li className={styles.listItem}>
              {/* TODO: link to terms and conditions */}
              <a {...itemProps[accounts ? 2 : 0]}>
                {t('component_Settings_t&c')}
              </a>
            </li>
            <li className={styles.listItem}>
              {/* TODO: link to FAQ */}
              <a {...itemProps[accounts ? 3 : 1]}>
                {t('component_Settings_faq')}
              </a>
            </li>

            <li className={styles.listItem}>
              <p>{t('component_Settings_version', [VERSION_NUMBER])}</p>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
