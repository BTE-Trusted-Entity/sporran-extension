import { browser } from 'webextension-polyfill-ts';
import { Link, useRouteMatch } from 'react-router-dom';

import { plural } from '../../utilities/plural/plural';
import { Account, isNew, useAccounts } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { generatePath, paths } from '../paths';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { AccountOverviewNew } from './AccountOverviewNew';

import styles from './AccountOverview.module.css';

interface Props {
  account: Account;
  nextTartan: string;
}

export function AccountOverview({
  account,
  nextTartan,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();

  const accounts = useAccounts().data;
  if (!accounts) {
    return null;
  }

  const accountsNumber = Object.values(accounts).length;
  const { address } = account;

  if (isNew(account)) {
    return <AccountOverviewNew nextTartan={nextTartan} />;
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

      <Balance address={address} />

      <p>
        <Link
          to={generatePath(paths.account.send, { address })}
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

      <Stats />
    </main>
  );
}
