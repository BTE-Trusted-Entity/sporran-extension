import { useState, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { Credential } from '../../utilities/credentials/credentials';

import * as styles from './CredentialCard.module.css';

interface Props {
  credential: Credential;
}

export function CredentialCard({ credential }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);
  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <li className={styles.credential} aria-expanded={expanded}>
      {!expanded && (
        <button type="button" className={styles.expand} onClick={handleExpand}>
          <section className={styles.collapsedCredential}>
            <h4 className={styles.collapsedName}>{credential.name}</h4>
            <p className={styles.collapsedFirstProp}>
              {Object.values(credential.request.claim.contents)[0]}
            </p>
          </section>
        </button>
      )}

      {expanded && (
        // TODO: https://kiltprotocol.atlassian.net/browse/SK-410
        <section className={styles.expanded}>
          <button
            type="button"
            aria-label={t('component_CredentialCard_collapse')}
            className={styles.collapse}
            onClick={handleCollapse}
          />
        </section>
      )}
    </li>
  );
}
