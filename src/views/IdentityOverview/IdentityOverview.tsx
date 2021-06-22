import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useParams, useRouteMatch, Redirect } from 'react-router-dom';

import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { IdentitySuccessOverlay } from '../../components/IdentitySuccessOverlay/IdentitySuccessOverlay';
import {
  Identity,
  isNew,
  useIdentities,
} from '../../utilities/identities/identities';
import { plural } from '../../utilities/plural/plural';
import { generatePath, paths } from '../paths';
import { IdentityOverviewNew } from './IdentityOverviewNew';

import styles from './IdentityOverview.module.css';

interface Props {
  identity: Identity;
}

export function IdentityOverview({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();
  const params = useParams() as { type?: 'created' | 'imported' | 'pwreset' };

  const [hasOpenOverlay, setHasOpenOverlay] = useState(Boolean(params.type));
  const [type] = useState(params.type);

  const handleSuccessOverlayButtonClick = useCallback(() => {
    setHasOpenOverlay(false);
  }, []);

  const identities = useIdentities().data;
  if (!identities) {
    return null;
  }

  const credentialsIdentity = null;
  // TODO: Use again when developing real credential API
  // const credentialsIdentity = minBy(Object.values(identities), 'index') as Identity;

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

      <Balance address={address} breakdown />

      <p>
        <Link
          to={generatePath(paths.identity.send.start, { address })}
          className={styles.button}
        >
          {t('view_IdentityOverview_send')}
        </Link>

        <Link
          to={generatePath(paths.identity.receive, { address })}
          className={styles.button}
        >
          {t('view_IdentityOverview_receive')}
        </Link>
      </p>

      {identity === credentialsIdentity && (
        <Link
          to={generatePath(paths.identity.credentials, { address })}
          className={styles.credentials}
        >
          {t('view_IdentityOverview_credentials')}
        </Link>
      )}

      <Stats />
      {hasOpenOverlay && type && (
        <IdentitySuccessOverlay
          successType={type}
          identity={identity}
          onSuccessOverlayButtonClick={handleSuccessOverlayButtonClick}
        />
      )}
    </main>
  );
}
