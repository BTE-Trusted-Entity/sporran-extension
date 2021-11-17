import { useRef } from 'react';
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

interface Props {
  identity: Identity;
}

export function IdentityCredentials({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const credentials = useIdentityCredentials(identity.did).reverse();

  const ref = useRef(null);

  if (isNew(identity)) {
    return <IdentityOverviewNew />;
  }

  if (credentials.length === 0) {
    return null; // storage data pending
    // TODO: https://kiltprotocol.atlassian.net/browse/SK-594
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_IdentityCredentials_title')}</h1>
      <p className={styles.subline}>{t('view_IdentityCredentials_subline')}</p>

      <IdentitiesCarousel identity={identity} />

      <ul className={styles.credentials} ref={ref}>
        {credentials.map((credential) => (
          <CredentialCard
            key={credential.request.rootHash}
            credential={credential}
            listRef={ref}
          />
        ))}
      </ul>

      <LinkBack />
      <Stats />
    </section>
  );
}
