import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useParams, useRouteMatch, Redirect } from 'react-router-dom';
import { minBy } from 'lodash-es';

import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { AccountSuccessOverlay } from '../../components/AccountSuccessOverlay/AccountSuccessOverlay';
import { Account, isNew, useAccounts } from '../../utilities/accounts/accounts';
import { plural } from '../../utilities/plural/plural';
import { generatePath, paths } from '../paths';
import { AccountOverviewNew } from './AccountOverviewNew';

import styles from './AccountOverview.module.css';

interface Props {
  account: Account;
}

export function AccountOverview({ account }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();
  const params = useParams() as { type?: 'created' | 'imported' | 'pwreset' };

  const [hasOpenOverlay, setHasOpenOverlay] = useState(Boolean(params.type));
  const [type] = useState(params.type);

  const handleSuccessOverlayButtonClick = useCallback(() => {
    setHasOpenOverlay(false);
  }, []);

  const accounts = useAccounts().data;
  if (!accounts) {
    return null;
  }

  const credentialsAccount = minBy(Object.values(accounts), 'index') as Account;
  const accountsNumber = Object.values(accounts).length;
  const { address } = account;

  if (params.type) {
    return <Redirect to={generatePath(paths.account.overview, { address })} />;
  }

  if (isNew(account)) {
    return <AccountOverviewNew />;
  }

  return (
    <main className={styles.container}>
      <header>
        <h1 className={styles.heading}>{t('view_AccountOverview_title')}</h1>
        <p className={styles.info}>
          {plural(accountsNumber, {
            one: 'view_AccountOverview_subtitle_one',
            other: 'view_AccountOverview_subtitle_other',
          })}
        </p>
      </header>

      <AccountsCarousel path={path} account={account} />

      <Balance address={address} breakdown />

      <p>
        <Link
          to={generatePath(paths.account.send.start, { address })}
          className={styles.button}
        >
          {t('view_AccountOverview_send')}
        </Link>

        <Link
          to={generatePath(paths.account.receive, { address })}
          className={styles.button}
        >
          {t('view_AccountOverview_receive')}
        </Link>
      </p>

      {account === credentialsAccount && (
        <Link
          to={generatePath(paths.account.credentials, { address })}
          className={styles.credentials}
        >
          {t('view_AccountOverview_credentials')}
        </Link>
      )}

      <Stats />
      {hasOpenOverlay && type && (
        <AccountSuccessOverlay
          successType={type}
          account={account}
          onSuccessOverlayButtonClick={handleSuccessOverlayButtonClick}
        />
      )}
    </main>
  );
}
