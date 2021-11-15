import { useState, useCallback } from 'react';

import { Credential } from '../../utilities/credentials/credentials';

import * as styles from './CredentialCard.module.css';

interface Props {
  credential: Credential;
}

export function CredentialCard({ credential }: Props): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);
  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <li
      className={styles.credential}
      aria-label="Credential"
      aria-expanded={expanded}
    >
      {!expanded && (
        <button
          type="button"
          className={styles.expand}
          onClick={handleExpand}
          aria-label="Expand Credential"
        >
          <dl className={styles.details}>
            <dt className={styles.detailName}>{credential.name}</dt>
            <dd className={styles.detailFirstProp}>
              {Object.values(credential.request.claim.contents)[0]}
            </dd>
          </dl>
        </button>
      )}

      {expanded && (
        // TODO: https://kiltprotocol.atlassian.net/browse/SK-410
        <section className={styles.expanded}>
          <button
            type="button"
            aria-label="collapse"
            className={styles.collapse}
            onClick={handleCollapse}
          />
        </section>
      )}
    </li>
  );
}
