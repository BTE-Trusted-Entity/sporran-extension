import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useParams, useRouteMatch, Redirect } from 'react-router-dom';

import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { IdentitySuccessOverlay } from '../../components/IdentitySuccessOverlay/IdentitySuccessOverlay';
import { UpcomingFeatureModal } from '../../components/UpcomingFeatureModal/UpcomingFeatureModal';

import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import {
  Identity,
  isNew,
  useIdentities,
} from '../../utilities/identities/identities';
import { plural } from '../../utilities/plural/plural';
import { generatePath, paths } from '../paths';
import { useConfiguration } from '../../configuration/useConfiguration';
import { IdentityOverviewNew } from './IdentityOverviewNew';

import styles from './IdentityOverview.module.css';

interface Props {
  identity: Identity;
}

export function IdentityOverview({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();
  const params = useParams() as { type?: 'created' | 'imported' | 'pwreset' };

  const { features } = useConfiguration();

  const [hasSuccessOverlay, setHasSuccessOverlay] = useState(
    Boolean(params.type),
  );
  const [type] = useState(params.type);

  const handleSuccessOverlayButtonClick = useCallback(() => {
    setHasSuccessOverlay(false);
  }, []);

  const [hasUpcomingFeatureModal, setHasUpcomingFeatureModal] = useState(false);

  const handleUpcomingFeatureModalButtonClick = useCallback(() => {
    setHasUpcomingFeatureModal(false);
  }, []);

  const handleSendClick = useCallback(() => {
    setHasUpcomingFeatureModal(true);
  }, []);

  const credentials = useIdentityCredentials(identity.address);
  const hasCredentials = credentials && credentials.length > 0;

  const identities = useIdentities().data;
  if (!identities) {
    return null; // storage data pending
  }

  const identitiesNumber = Object.values(identities).length;

  const { address } = identity;

  if (params.type) {
    return <Redirect to={generatePath(paths.identity.overview, { address })} />;
  }

  if (isNew(identity)) {
    return <IdentityOverviewNew />;
  }

  return (
    <main className={styles.container}>
      <header>
        <h1 className={styles.heading}>{t('view_IdentityOverview_title')}</h1>
        <p className={styles.info}>
          {plural(identitiesNumber, {
            one: 'view_IdentityOverview_subtitle_one',
            other: 'view_IdentityOverview_subtitle_other',
          })}
        </p>
      </header>

      <IdentitiesCarousel path={path} identity={identity} />

      <Balance address={address} breakdown smallDecimals />

      <p>
        {features.sendToken ? (
          <Link
            to={generatePath(paths.identity.send.start, { address })}
            className={styles.button}
          >
            {t('view_IdentityOverview_send')}
          </Link>
        ) : (
          <button
            type="button"
            className={styles.button}
            onClick={handleSendClick}
          >
            {t('view_IdentityOverview_send')}
          </button>
        )}

        <Link
          to={generatePath(paths.identity.receive, { address })}
          className={styles.button}
        >
          {t('view_IdentityOverview_receive')}
        </Link>
      </p>

      {features.credentials && hasCredentials && (
        <Link
          to={generatePath(paths.identity.credentials, { address })}
          className={styles.credentials}
        >
          {t('view_IdentityOverview_credentials')}
        </Link>
      )}

      {features.subscan && (
        <a
          className={styles.subscan}
          href={`https://kilt-testnet.subscan.io/account/${identity.address}?tab=transfer`}
          target="_blank"
          rel="noreferrer"
        >
          {t('view_IdentityOverview_subscan')}
        </a>
      )}

      <Stats />

      {hasSuccessOverlay && type && (
        <IdentitySuccessOverlay
          successType={type}
          identity={identity}
          onSuccessOverlayButtonClick={handleSuccessOverlayButtonClick}
        />
      )}
      {hasUpcomingFeatureModal && (
        <UpcomingFeatureModal onClose={handleUpcomingFeatureModalButtonClick} />
      )}
    </main>
  );
}
