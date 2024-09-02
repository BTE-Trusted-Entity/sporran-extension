import { useCallback, useState } from 'react';
import browser from 'webextension-polyfill';
import { Link, Redirect, useParams } from 'react-router-dom';

import * as styles from './IdentityOverview.module.css';

import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { IdentitySuccessOverlay } from '../../components/IdentitySuccessOverlay/IdentitySuccessOverlay';

import { Identity, isNew } from '../../utilities/identities/identities';
import { isFullDid } from '../../utilities/did/did';
import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';
import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { generatePath, paths } from '../paths';
// import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';

import { useIdentityCredentials } from '../../utilities/credentials/credentials';

import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

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

  // const subscanHost = useSubscanHost();

  const { address, did } = identity;

  const sporranCredentials = useIdentityCredentials(did);

  const showDownloadPrompt = sporranCredentials?.some(
    ({ isDownloaded }) => !isDownloaded,
  );

  const upgradeDid = !isFullDid(did);
  const manageDid = did && isFullDid(did);

  const web3name = useWeb3Name(did);
  const wasOnChainDidDeleted = useIsOnChainDidDeleted(did);

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
          <YouHaveIdentities />
        </p>
      </header>

      <IdentitiesCarousel identity={identity} options />

      <Balance address={address} breakdown smallDecimals />

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

      {/* {subscanHost && (
        <a
          className={styles.subscan}
          href={`${subscanHost}/account/${identity.address}?tab=transfer`}
          target="_blank"
          rel="noreferrer"
        >
          {t('view_IdentityOverview_subscan')}
        </a>
      )} */}

      <Link
        to={generatePath(paths.identity.credentials.base, { address })}
        className={
          showDownloadPrompt ? styles.downloadPrompt : styles.credentials
        }
        aria-label={
          showDownloadPrompt
            ? `${t('view_IdentityOverview_credentials')}. ${t(
                'view_IdentityOverview_download_prompt',
              )}`
            : undefined
        }
      >
        {t('view_IdentityOverview_credentials')}
      </Link>

      {upgradeDid && (
        <Link
          to={generatePath(paths.identity.did.upgrade.start, { address })}
          className={styles.upgrade}
        >
          {wasOnChainDidDeleted || !did
            ? t('view_IdentityOverview_did_removed')
            : t('view_IdentityOverview_upgrade')}
        </Link>
      )}

      {manageDid && (
        <Link
          to={generatePath(paths.identity.did.manage.start, { address })}
          className={styles.manage}
        >
          {t('view_IdentityOverview_on_chain')}
        </Link>
      )}

      {!web3name && did && (
        <Link
          to={generatePath(paths.identity.web3name.create.info, {
            address,
          })}
          className={styles.web3Name}
        >
          {t('view_IdentityOverview_web3name_create')}
        </Link>
      )}

      {web3name && (
        <Link
          to={generatePath(paths.identity.web3name.manage.start, { address })}
          className={styles.web3Name}
        >
          <span className={styles.web3NameManage}>
            {t('view_IdentityOverview_web3name_manage', [web3name])}
          </span>
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
    </main>
  );
}
