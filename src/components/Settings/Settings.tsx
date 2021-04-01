import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { Link, Route } from 'react-router-dom';

import { useAccounts } from '../../utilities/accounts/accounts';
import { generatePath, paths } from '../../views/paths';

import styles from './Settings.module.css';

export function Settings(): JSX.Element {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts().data;
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
            <Route
              path={paths.account.overview}
              render={({ match }) => {
                const { address } = match.params;
                return (
                  <>
                    <li className={styles.listItem}>
                      {/* TODO: forget account - https://kiltprotocol.atlassian.net/browse/SK-59 */}
                      <a {...itemProps.shift()}>
                        {t('component_Settings_forget')}
                      </a>
                    </li>

                    <li className={styles.listItem}>
                      <Link
                        to={generatePath(paths.account.reset.start, {
                          address,
                        })}
                        {...itemProps.shift()}
                      >
                        {t('component_Settings_reset_password')}
                      </Link>
                    </li>
                  </>
                );
              }}
            />

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
