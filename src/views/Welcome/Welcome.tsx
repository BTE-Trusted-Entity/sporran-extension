import { Fragment } from 'react';
import browser from 'webextension-polyfill';
import { Link, Redirect } from 'react-router-dom';

import * as styles from './Welcome.module.css';

import {
  useCurrentIdentity,
  useIdentities,
} from '../../utilities/identities/identities';
import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { generatePath, paths } from '../paths';

interface Props {
  again?: boolean;
}

export function Welcome({ again = false }: Props) {
  const t = browser.i18n.getMessage;

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

      <Link to={paths.identity.create.start} className={styles.create}>
        {t('view_Welcome_create')}
      </Link>

      <Link to={paths.identity.import.start} className={styles.importPhrase}>
        {t('view_Welcome_import')}
      </Link>

      {again && <LinkBack />}
    </div>
  );
}
