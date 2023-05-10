import {
  ChangeEvent,
  Fragment,
  JSX,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, Redirect } from 'react-router-dom';

import * as styles from './Welcome.module.css';

import {
  useIdentities,
  useCurrentIdentity,
} from '../../utilities/identities/identities';
import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { generatePath, paths } from '../paths';

interface Props {
  again?: boolean;
}

export function Welcome({ again = false }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const [enabled, setEnabled] = useState(false);
  const handleTermsClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEnabled(event.target.checked);
    },
    [],
  );

  const handleLinkClick = useCallback(
    (event: MouseEvent) => {
      if (!enabled) {
        event.preventDefault();
      }
    },
    [enabled],
  );

  const identities = useIdentities();
  const current = useCurrentIdentity();

  if (!identities.data) {
    return null; // storage data pending
  }

  const identitiesNumber = Object.values(identities.data).length;
  const hasIdentities = identitiesNumber > 0;

  if (current && hasIdentities && !again) {
    return (
      <Redirect
        to={generatePath(
          paths.identity.overview,
          identities.data[current] as { address: string },
        )}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        {hasIdentities ? t('view_Welcome_again') : t('view_Welcome_heading')}
      </h1>

      <h3 className={styles.info}>
        {hasIdentities ? (
          <Fragment>
            <YouHaveIdentities />
            {t('view_Welcome_addAnother')}
          </Fragment>
        ) : (
          t('view_Welcome_noIdentities')
        )}
      </h3>

      <p className={styles.termsLine}>
        <label className={styles.agreeLabel}>
          <input
            className={styles.agree}
            type="checkbox"
            onChange={handleTermsClick}
            checked={enabled}
          />
          <span />
          {t('view_Welcome_agree')}
        </label>
        <a
          className={styles.terms}
          href="https://www.sporran.org/terms"
          target="_blank"
          rel="noreferrer"
        >
          {t('view_Welcome_terms')}
        </a>
      </p>

      <Link
        to={paths.identity.create.start}
        className={styles.create}
        onClick={handleLinkClick}
        aria-disabled={!enabled}
      >
        {t('view_Welcome_create')}
      </Link>

      <Link
        to={paths.identity.import.start}
        className={styles.importPhrase}
        onClick={handleLinkClick}
        aria-disabled={!enabled}
      >
        {t('view_Welcome_import')}
      </Link>

      {again && <LinkBack />}
    </div>
  );
}
