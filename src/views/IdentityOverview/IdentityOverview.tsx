import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useParams, Redirect } from 'react-router-dom';

import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { IdentitySuccessOverlay } from '../../components/IdentitySuccessOverlay/IdentitySuccessOverlay';
import { UpcomingFeatureModal } from '../../components/UpcomingFeatureModal/UpcomingFeatureModal';

import {
  Identity,
  isNew,
  useIdentities,
} from '../../utilities/identities/identities';
import { isFullDid } from '../../utilities/did/did';
import { plural } from '../../utilities/plural/plural';
import { generatePath, paths } from '../paths';
import { useConfiguration } from '../../configuration/useConfiguration';
import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';
import { IdentityOverviewNew } from './IdentityOverviewNew';

import * as styles from './IdentityOverview.module.css';

interface Props {
  identity: Identity;
}

export function IdentityOverview({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
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

  const subscanHost = useSubscanHost();

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

      <IdentitiesCarousel identity={identity} />

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

      {features.subscan && subscanHost && (
        <a
          className={styles.subscan}
          href={`${subscanHost}/account/${identity.address}?tab=transfer`}
          target="_blank"
          rel="noreferrer"
        >
          {t('view_IdentityOverview_subscan')}
        </a>
      )}

      {features.credentials && (
        <Link
          to={generatePath(paths.identity.credentials, { address })}
          className={styles.credentials}
        >
          {t('view_IdentityOverview_credentials')}
        </Link>
      )}

      {!isFullDid(identity.did) ? (
        <Link
          to={generatePath(paths.identity.did.upgrade.start, { address })}
          className={styles.upgrade}
        >
          {t('view_IdentityOverview_upgrade')}
        </Link>
      ) : (
        <Link
          to={generatePath(paths.identity.did.manage.start, { address })}
          className={styles.manage}
        >
          {t('view_IdentityOverview_on_chain')}
        </Link>
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
