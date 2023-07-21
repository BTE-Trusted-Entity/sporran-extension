import { JSX, useCallback } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import browser from 'webextension-polyfill';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import * as menuStyles from '../Menu/Menu.module.css';
import * as styles from './AddIdentity.module.css';

import { paths } from '../../views/paths';
import { NEW } from '../../utilities/identities/identities';
import { showPopup } from '../../channels/base/PopupChannel/PopupMessages';

export function AddIdentity(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(2);

  const handleClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleImportClick = useCallback(async () => {
    await showPopup('import', {}, '', {});
    window.close();
  }, []);

  const match = useRouteMatch(paths.identity.overview);
  if (!match) {
    return null; // hide when no identities
  }

  const { address } = match.params as { address: string };
  if (address === NEW.address) {
    return null; // hide while creating identity
  }

  return (
    <div className={menuStyles.wrapper}>
      <button
        {...buttonProps}
        type="button"
        className={styles.toggle}
        title={t('component_AddIdentity_label')}
        aria-label={t('component_AddIdentity_label')}
      />

      {isOpen && (
        <div className={menuStyles.dropdown} role="menu" onClick={handleClick}>
          <h4 className={menuStyles.heading}>
            {t('component_AddIdentity_label')}
          </h4>

          <ul className={menuStyles.list}>
            <li className={menuStyles.listItem}>
              <Link to={paths.identity.add} {...itemProps.shift()}>
                {t('component_AddIdentity_create')}
              </Link>
            </li>

            <li className={menuStyles.listItem}>
              <Link
                to={paths.popup.import}
                {...itemProps.shift()}
                onClick={handleImportClick}
              >
                {t('component_AddIdentity_importCredentials')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
