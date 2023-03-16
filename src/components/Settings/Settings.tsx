import { useCallback, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { Link, useRouteMatch } from 'react-router-dom';

import * as menuStyles from '../Menu/Menu.module.css';
import * as styles from './Settings.module.css';

import { useIdentities } from '../../utilities/identities/identities';
import {
  forgetAllPasswordsChannel,
  hasSavedPasswordsChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { useConfiguration } from '../../configuration/useConfiguration';
import { generatePath, paths } from '../../views/paths';

function useItemsCount(onExistingIdentity: boolean, hasPasswords: boolean) {
  const itemCounts = {
    generic: 5,
    identity: onExistingIdentity ? 2 : 0,
    forgetPasswords: onExistingIdentity && hasPasswords ? 1 : 0,
  };

  return itemCounts.generic + itemCounts.identity + itemCounts.forgetPasswords;
}

export function Settings() {
  const t = browser.i18n.getMessage;

  const [hasPasswords, setHasPasswords] = useState(false);

  const match = useRouteMatch(paths.identity.overview);
  const address = (match?.params as { address: string })?.address;
  const identities = useIdentities().data;
  const onExistingIdentity = Boolean(identities?.[address]);

  const { version } = useConfiguration();

  const count = useItemsCount(onExistingIdentity, hasPasswords);
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
            {onExistingIdentity && (
              <>
                <li className={menuStyles.listItem}>
                  <Link
                    to={generatePath(paths.identity.remove, { address })}
                    {...itemProps.shift()}
                  >
                    {t('component_Settings_forget')}
                  </Link>
                </li>

                <li className={menuStyles.listItem}>
                  <Link
                    to={generatePath(paths.identity.reset.start, {
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
                    {...(hasPasswords &&
                      (itemProps.shift() as Record<string, unknown>))}
                    onClick={handleForgetAllClick}
                    disabled={!hasPasswords}
                  >
                    {t('component_Settings_forget_saved_passwords')}
                  </button>
                </li>
              </>
            )}

            <li className={menuStyles.listItem}>
              <Link to={paths.access} {...itemProps.shift()}>
                {t('component_Settings_access')}
              </Link>
            </li>

            <li className={menuStyles.listItem}>
              <Link to={paths.settings} {...itemProps.shift()}>
                {t('component_Settings_endpoint')}
              </Link>
            </li>

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
