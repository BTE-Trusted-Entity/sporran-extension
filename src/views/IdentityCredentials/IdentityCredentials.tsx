import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { Identity } from '../../utilities/identities/types';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';

import { isNew } from '../../utilities/identities/identities';
import { IdentityOverviewNew } from '../IdentityOverview/IdentityOverviewNew';
import { CredentialCard } from '../../components/CredentialCard/CredentialCard';

import * as styles from './IdentityCredentials.module.css';
import { useMemo } from 'react';

interface Props {
  identity: Identity;
}

export function IdentityCredentials({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const identityCredentials = useIdentityCredentials(identity.did);

  const credentials = useMemo(
    () => identityCredentials.concat().reverse(),
    [identityCredentials],
  );

  const credentialCount = credentials.length;

  if (isNew(identity)) {
    return <IdentityOverviewNew />;
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_IdentityCredentials_title')}</h1>
      <p className={styles.subline}>{t('view_IdentityCredentials_subline')}</p>

      <IdentitiesCarousel identity={identity} />

      {credentials.length === 0 ? (
        <section className={styles.noCredentials}>
          <p className={styles.info}>
            {t('view_IdentityCredentials_no_credentials')}
          </p>

          {/* TODO: link to https://kiltprotocol.atlassian.net/browse/SK-552 */}
          <Link to="" className={styles.explainerLink}>
            {t('view_IdentityCredentials_explainer')}
          </Link>
        </section>
      ) : (
        <ul className={styles.credentials}>
          {credentials.map((credential, index) => (
            <CredentialCard
              key={credential.request.rootHash}
              credential={credential}
              expand={index + 1 === credentialCount && credentialCount < 7}
            />
          ))}
        </ul>
      )}
      <LinkBack />
      <Stats />
    </section>
  );
}
