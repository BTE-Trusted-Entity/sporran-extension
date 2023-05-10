import { Modal } from 'react-dialog-polyfill';
import { browser } from 'webextension-polyfill-ts';
import { generatePath, Link } from 'react-router-dom';
import { JSX, useEffect } from 'react';

import * as styles from './LegacyDids.module.css';

import { paths } from '../../views/paths';

import { useLegacyDidIdentities } from '../../utilities/legacyDids/legacyDids';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

export function LegacyDids(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const legacyDidIdentities = useLegacyDidIdentities();

  const open = useBooleanState();

  useEffect(() => {
    open.set(Object.values(legacyDidIdentities).length > 0);
  }, [legacyDidIdentities, open]);

  if (!open.current) {
    return null;
  }

  return (
    <Modal open className={styles.overlay}>
      <h1 className={styles.heading}>{t('component_LegacyDids_heading')}</h1>

      <p className={styles.explanation}>
        {t('component_LegacyDids_explanation')}
      </p>
      <p className={styles.cta}>{t('component_LegacyDids_cta')}</p>

      <h3 className={styles.listHeading}>{t('component_LegacyDids_dids')}</h3>
      <ul className={styles.list}>
        {Object.values(legacyDidIdentities).map((identity) => (
          <li key={identity.address}>
            <Link
              to={generatePath(paths.identity.overview, {
                address: identity.address,
              })}
              onClick={open.off}
              className={styles.legacyIdentity}
            >
              {identity.name}
            </Link>
          </li>
        ))}
      </ul>

      <button className={styles.close} onClick={open.off}>
        {t('common_action_close')}
      </button>
    </Modal>
  );
}
