import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { SWRResponse } from 'swr';

import {
  useAccounts as useAccountsDI,
  AccountsMap,
} from '../../utilities/accounts/accounts';

import styles from './Settings.module.css';

interface Props {
  useAccounts?: () => SWRResponse<AccountsMap, unknown>;
}

export function Settings({ useAccounts = useAccountsDI }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts();
  const hasAccounts = accounts.data && Object.values(accounts.data).length > 0;

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
        <div className={styles.menu} role="menu">
          <h4 className={styles.menuHeading}>
            {t('component_Settings_label')}
          </h4>

          <ul className={styles.list}>
            {hasAccounts && (
              <li className={styles.listItem}>
                {/* TODO: forget account - https://kiltprotocol.atlassian.net/browse/SK-59 */}
                <a {...itemProps.shift()}>{t('component_Settings_forget')}</a>
              </li>
            )}
            {hasAccounts && (
              <li className={styles.listItem}>
                {/* TODO: reset password - https://kiltprotocol.atlassian.net/browse/SK-55 */}
                <a {...itemProps.shift()}>
                  {t('component_Settings_reset_password')}
                </a>
              </li>
            )}
            <li className={styles.listItem}>
              {/* TODO: link to terms and conditions */}
              <a {...itemProps.shift()}>
                {t('component_Settings_terms_and_conditions')}
              </a>
            </li>
            <li className={styles.listItem}>
              {/* TODO: link to FAQ */}
              <a {...itemProps.shift()}>{t('component_Settings_faq')}</a>
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
