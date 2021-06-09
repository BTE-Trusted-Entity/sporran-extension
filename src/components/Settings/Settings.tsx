import { useCallback, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { Link, useRouteMatch } from 'react-router-dom';

import { useAccounts } from '../../utilities/accounts/accounts';
import {
  forgetAllPasswordsChannel,
  hasSavedPasswordsChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { useConfiguration } from '../../configuration/useConfiguration';
import { generatePath, paths } from '../../views/paths';

import menuStyles from '../Menu/Menu.module.css';
import styles from './Settings.module.css';

function useItemsCount(onExistingAccount: boolean, hasPasswords: boolean) {
  const { features } = useConfiguration();

  const itemCounts = {
    generic: 4,
    endpoint: features.endpoint ? 1 : 0,
    account: onExistingAccount ? 2 : 0,
    forgetPasswords: onExistingAccount && hasPasswords ? 1 : 0,
  };

  return (
    itemCounts.generic +
    itemCounts.endpoint +
    itemCounts.account +
    itemCounts.forgetPasswords
  );
}

export function Settings(): JSX.Element {
  const t = browser.i18n.getMessage;

  const [hasPasswords, setHasPasswords] = useState(false);

  const match = useRouteMatch(paths.account.overview);
  const address = (match?.params as { address: string })?.address;
  const accounts = useAccounts().data;
  const onExistingAccount = Boolean(accounts?.[address]);

  const { version, features } = useConfiguration();

  const count = useItemsCount(onExistingAccount, hasPasswords);
  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(count);

  const handleClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    (async () => {
      setHasPasswords(await hasSavedPasswordsChannel.get());
    })();
  }, [isOpen]);

  const handleForgetAllClick = useCallback(async () => {
    await forgetAllPasswordsChannel.get();
  }, []);

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
            {onExistingAccount && (
              <>
                <li className={menuStyles.listItem}>
                  <Link
                    to={generatePath(paths.account.remove, { address })}
                    {...itemProps.shift()}
                  >
                    {t('component_Settings_forget')}
                  </Link>
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
                <li
                  className={
                    hasPasswords ? menuStyles.listItem : menuStyles.disabled
                  }
                >
                  <button
                    type="button"
                    className={menuStyles.listButton}
                    {...(hasPasswords && (itemProps.shift() as unknown))}
                    onClick={handleForgetAllClick}
                    disabled={!hasPasswords}
                  >
                    {t('component_Settings_forget_saved_passwords')}
                  </button>
                </li>
              </>
            )}

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
              <Link to={paths.access} {...itemProps.shift()}>
                {t('component_Settings_access')}
              </Link>
            </li>

            {features.endpoint && (
              <li className={menuStyles.listItem}>
                <Link to={paths.settings} {...itemProps.shift()}>
                  {t('component_Settings_endpoint')}
                </Link>
              </li>
            )}

            <li className={menuStyles.listItem}>
              <a {...itemProps.shift()}>
                {t('component_Settings_version', [version])}
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
