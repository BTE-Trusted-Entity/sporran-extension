import { useCallback, useMemo, useState } from 'react';
import browser from 'webextension-polyfill';
import { Link, Redirect, useParams } from 'react-router-dom';

import * as styles from './IdentityOverview.module.css';

import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { IdentitySuccessOverlay } from '../../components/IdentitySuccessOverlay/IdentitySuccessOverlay';

import { Identity, isNew } from '../../utilities/identities/identities';
import { generatePath, paths } from '../paths';

import { useIdentityCredentials } from '../../utilities/credentials/credentials';

import { showPopup } from '../../channels/base/PopupChannel/PopupMessages';

import { CredentialCard } from '../../components/CredentialCard/CredentialCard';

import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';

import { IdentityOverviewNew } from './IdentityOverviewNew';

interface Props {
  identity: Identity;
}

export function IdentityOverview({ identity }: Props) {
  const t = browser.i18n.getMessage;
  const params = useParams() as { type?: 'created' | 'imported' | 'pwreset' };

  const [hasSuccessOverlay, setHasSuccessOverlay] = useState(
    Boolean(params.type),
  );
  const [type] = useState(params.type);

  const handleSuccessOverlayButtonClick = useCallback(() => {
    setHasSuccessOverlay(false);
  }, []);

  const { address, did } = identity;

  const identityCredentials = useIdentityCredentials(did, false);

  const credentials = useMemo(
    () => identityCredentials?.concat().reverse(),
    [identityCredentials],
  );

  const handleImportClick = useCallback(async () => {
    await showPopup('import', {}, '', {});
    window.close();
  }, []);

  if (params.type) {
    return <Redirect to={generatePath(paths.identity.overview, { address })} />;
  }

  if (isNew(identity)) {
    return <IdentityOverviewNew />;
  }

  if (!credentials) {
    return null; // storage data pending
  }

  const credentialCount = credentials.length;

  return (
    <main className={styles.container}>
      <header>
        <h1 className={styles.heading}>{t('view_IdentityOverview_title')}</h1>
        <p className={styles.subline}>
          <YouHaveIdentities />
        </p>
      </header>

      <IdentitiesCarousel identity={identity} options />

      <ul className={styles.credentials}>
        <li>
          <Link
            to={paths.popup.import}
            onClick={handleImportClick}
            className={styles.importCredential}
          >
            {t('view_IdentityOverview_import')}
          </Link>
        </li>

        {credentials.length === 0 ? (
          <li className={styles.noCredentials}>
            <p className={styles.info}>
              {t('view_IdentityOverview_no_credentials')}
            </p>

            <a
              href="https://socialkyc.io/"
              target="_blank"
              rel="noreferrer"
              className={styles.explainerLink}
            >
              {t('view_IdentityOverview_explainer')}
            </a>
          </li>
        ) : (
          credentials.map((sporranCredential, index) => (
            <CredentialCard
              key={sporranCredential.credential.rootHash}
              sporranCredential={sporranCredential}
              expand={index + 1 === credentialCount && credentialCount < 7}
            />
          ))
        )}
      </ul>

      {hasSuccessOverlay && type && (
        <IdentitySuccessOverlay
          successType={type}
          identity={identity}
          onSuccessOverlayButtonClick={handleSuccessOverlayButtonClick}
        />
      )}
    </main>
  );
}
