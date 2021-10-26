import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import { useConfiguration } from '../../configuration/useConfiguration';
import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../../views/paths';

import * as menuStyles from '../Menu/Menu.module.css';
import * as styles from './IdentityOptions.module.css';
import { isFullDid } from '../../utilities/did/did';

interface Props {
  identity: Identity;
  onEdit: () => void;
}

export function IdentityOptions({ identity, onEdit }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { features } = useConfiguration();

  const { address, did } = identity;

  const didUpgraded = isFullDid(did);

  const itemCount = features.fullDid && didUpgraded ? 4 : 3;
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
                {...(itemProps[0] as unknown)}
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
            {didUpgraded && (
              <li className={menuStyles.listItem}>
                <Link
                  to={generatePath(paths.identity.did.downgrade.start, {
                    address,
                  })}
                  {...itemProps[3]}
                >
                  {t('component_IdentityOptions_did_downgrade')}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
