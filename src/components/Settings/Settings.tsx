import { useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { Link, Route } from 'react-router-dom';

import { useAccounts } from '../../utilities/accounts/accounts';
import { generatePath, paths } from '../../views/paths';

import menuStyles from '../Menu/Menu.module.css';
import styles from './Settings.module.css';

export function Settings(): JSX.Element {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts().data;
  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(
    accounts ? 4 : 2,
  );

  const handleClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // TODO - move version number to config
  const VERSION_NUMBER = '1.0.0';

  return (
    <div className={menuStyles.wrapper}>
      <button
        {...buttonProps}
        type="button"
        className={styles.toggle}
        title={t('component_Settings_label')}
        aria-label={t('component_Settings_label')}
      />

      {isOpen && (
        <div className={menuStyles.dropdown} role="menu" onClick={handleClick}>
          <h4 className={menuStyles.heading}>
            {t('component_Settings_label')}
          </h4>

          <ul className={menuStyles.list}>
            <Route
              path={paths.account.overview}
              render={({ match }) => {
                const { address } = match.params;
                return (
                  <>
                    <li className={menuStyles.listItem}>
                      {/* TODO: forget account - https://kiltprotocol.atlassian.net/browse/SK-59 */}
                      <a {...itemProps.shift()}>
                        {t('component_Settings_forget')}
                      </a>
                    </li>

                    <li className={menuStyles.listItem}>
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

            <li className={menuStyles.listItem}>
              {/* TODO: link to terms and conditions */}
              <a {...itemProps.shift()}>
                {t('component_Settings_terms_and_conditions')}
              </a>
            </li>
            <li className={menuStyles.listItem}>
              {/* TODO: link to FAQ */}
              <a {...itemProps.shift()}>{t('component_Settings_faq')}</a>
            </li>

            <li className={menuStyles.listItem}>
              <a>{t('component_Settings_version', [VERSION_NUMBER])}</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
