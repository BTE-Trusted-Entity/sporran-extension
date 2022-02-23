import { Modal } from 'react-dialog-polyfill';
import { browser } from 'webextension-polyfill-ts';
import { generatePath, Link } from 'react-router-dom';

import * as styles from './LegacyDids.module.css';

import { paths } from '../../views/paths';

import { IdentitiesMap } from '../../utilities/identities/types';

interface Props {
  identities: IdentitiesMap;
  onClose: () => void;
}

export function LegacyDids({ identities, onClose }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <Modal open className={styles.overlay}>
      <h1 className={styles.heading}>{t('component_LegacyDids_heading')}</h1>

      <p className={styles.explanation}>
        {t('component_LegacyDids_explanation')}
      </p>
      <p className={styles.cta}>{t('component_LegacyDids_cta')}</p>

      <h3 className={styles.listHeading}>{t('component_LegacyDids_dids')}</h3>
      <ul className={styles.list}>
        {Object.values(identities).map((identity) => (
          <li key={identity.address}>
            <Link
              to={generatePath(paths.identity.overview, {
                address: identity.address,
              })}
              onClick={onClose}
              className={styles.legacyIdentity}
            >
              {identity.name}
            </Link>
          </li>
        ))}
      </ul>

      <button className={styles.close} onClick={onClose}>
        {t('common_action_close')}
      </button>
    </Modal>
  );
}
