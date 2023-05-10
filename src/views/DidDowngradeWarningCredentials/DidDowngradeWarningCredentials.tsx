import { JSX } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './DidDowngradeWarningCredentials.module.css';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { CredentialCard } from '../../components/CredentialCard/CredentialCard';
import { Avatar } from '../../components/Avatar/Avatar';

interface Props {
  identity: Identity;
}

export function DidDowngradeWarningCredentials({
  identity,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const sporranCredentials = useIdentityCredentials(identity.did);

  const { address } = identity;

  if (!sporranCredentials) {
    return null; // storage data pending
  }

  if (sporranCredentials.length === 0) {
    return <Redirect to={paths.identity.did.manage.downgrade.sign} />;
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidDowngradeWarningCredentials_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_DidDowngradeWarningCredentials_subline')}
      </p>

      <Avatar identity={identity} />

      <p className={styles.warning}>
        {t('view_DidDowngradeWarningCredentials_warning')}
      </p>

      <ul className={styles.credentials}>
        {sporranCredentials.map((sporranCredential, index) => (
          <CredentialCard
            key={sporranCredential.credential.rootHash}
            sporranCredential={sporranCredential}
            buttons={false}
            expand={
              index + 1 === sporranCredentials.length &&
              sporranCredentials.length < 5
            }
          />
        ))}
      </ul>

      <p className={styles.buttonsLine}>
        <Link
          to={generatePath(paths.identity.did.manage.start, { address })}
          className={styles.cancel}
        >
          {t('common_action_cancel')}
        </Link>
        <Link
          to={generatePath(paths.identity.did.manage.downgrade.sign, {
            address,
          })}
          className={styles.cta}
        >
          {t('common_action_continue')}
        </Link>
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
