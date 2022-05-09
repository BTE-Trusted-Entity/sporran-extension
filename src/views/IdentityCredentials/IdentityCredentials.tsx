import { browser } from 'webextension-polyfill-ts';
import { useMemo, useCallback } from 'react';

import { Link } from 'react-router-dom';

import * as styles from './IdentityCredentials.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';

import { isNew } from '../../utilities/identities/identities';
import { IdentityOverviewNew } from '../IdentityOverview/IdentityOverviewNew';
import { CredentialCard } from '../../components/CredentialCard/CredentialCard';
import { paths } from '../paths';
import { showPopup } from '../../channels/base/PopupChannel/PopupMessages';

interface Props {
  identity: Identity;
}

export function IdentityCredentials({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const identityCredentials = useIdentityCredentials(identity.did);

  const credentials = useMemo(
    () => identityCredentials?.concat().reverse(),
    [identityCredentials],
  );

  const handleImportClick = useCallback(async () => {
    await showPopup('import', {}, '', {});
    window.close();
  }, []);

  if (isNew(identity)) {
    return <IdentityOverviewNew />;
  }

  if (!credentials) {
    return null; // storage data pending
  }

  const credentialCount = credentials.length;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_IdentityCredentials_title')}</h1>
      <p className={styles.subline}>{t('view_IdentityCredentials_subline')}</p>

      <IdentitiesCarousel identity={identity} />

      <ul className={styles.credentials}>
        <li>
          <Link
            to={paths.popup.import}
            onClick={handleImportClick}
            className={styles.importCredential}
          >
            {t('view_IdentityCredentials_import')}
          </Link>
        </li>

        {credentials.length === 0 ? (
          <li className={styles.noCredentials}>
            <p className={styles.info}>
              {t('view_IdentityCredentials_no_credentials')}
            </p>

            <a
              href="https://socialkyc.io/"
              target="_blank"
              rel="noreferrer"
              className={styles.explainerLink}
            >
              {t('view_IdentityCredentials_explainer')}
            </a>
          </li>
        ) : (
          credentials.map((credential, index) => (
            <CredentialCard
              key={credential.request.rootHash}
              credential={credential}
              expand={index + 1 === credentialCount && credentialCount < 7}
            />
          ))
        )}
      </ul>

      <LinkBack />
      <Stats />
    </section>
  );
}
