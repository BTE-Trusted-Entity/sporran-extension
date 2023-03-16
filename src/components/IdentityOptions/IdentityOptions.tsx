import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import * as menuStyles from '../Menu/Menu.module.css';
import * as styles from './IdentityOptions.module.css';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../../views/paths';
import { isFullDid } from '../../utilities/did/did';

interface Props {
  identity: Identity;
  onEdit: () => void;
}

export function IdentityOptions({ identity, onEdit }: Props) {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;

  const isLightDid = !isFullDid(did);
  const itemCount = isLightDid ? 4 : 3;
  const { buttonProps, itemProps, isOpen, setIsOpen } =
    useDropdownMenu(itemCount);

  const handleClick = useCallback(() => {
    onEdit();
    setIsOpen(false);
  }, [onEdit, setIsOpen]);

  return (
    <div className={styles.wrapper}>
      <button
        {...buttonProps}
        type="button"
        title={t('component_IdentityOptions_label')}
        aria-label={t('component_IdentityOptions_label')}
        className={styles.toggle}
      />

      {isOpen && (
        <div className={menuStyles.dropdown} role="menu">
          <h4 className={menuStyles.heading}>
            {t('component_IdentityOptions_heading')}
          </h4>

          <ul className={menuStyles.list}>
            <li className={menuStyles.listItem}>
              <button
                type="button"
                {...(itemProps[0] as Record<string, unknown>)}
                onClick={handleClick}
                className={menuStyles.listButton}
              >
                {t('component_IdentityOptions_edit')}
              </button>
            </li>
            <li className={menuStyles.listItem}>
              <Link
                to={generatePath(paths.identity.remove, { address })}
                {...itemProps[1]}
              >
                {t('component_IdentityOptions_forget')}
              </Link>
            </li>
            <li className={menuStyles.listItem}>
              <Link
                to={generatePath(paths.identity.reset.start, { address })}
                {...itemProps[2]}
              >
                {t('component_IdentityOptions_reset_password')}
              </Link>
            </li>

            {isLightDid && (
              <li className={menuStyles.listItem}>
                <Link
                  to={generatePath(paths.identity.upgradeDid, { address })}
                  {...itemProps[3]}
                >
                  {t('component_IdentityOptions_upgrade_did')}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
