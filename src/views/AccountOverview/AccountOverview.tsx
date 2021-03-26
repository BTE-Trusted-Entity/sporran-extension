import { browser } from 'webextension-polyfill-ts';
import { Link, useRouteMatch } from 'react-router-dom';

import { plural } from '../../utilities/plural/plural';
import { Account, AccountsMap, isNew } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { generatePath, paths } from '../paths';
import { Balance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { AccountOverviewNew } from './AccountOverviewNew';

interface Props {
  account: Account;
  accounts: AccountsMap;
}

export function AccountOverview({ account, accounts }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();

  const accountsNumber = Object.values(accounts).length;
  const { address } = account;

  if (isNew(account)) {
    return <AccountOverviewNew accounts={accounts} />;
  }

  return (
    <main>
      <header>
        <h1>{t('view_AccountOverview_title')}</h1>
        <p>
          {plural(accountsNumber, {
            one: 'view_AccountOverview_subtitle_one',
            other: 'view_AccountOverview_subtitle_other',
          })}
        </p>
      </header>

      <AccountsCarousel path={path} account={account} accounts={accounts} />

      <p>
        <Balance address={address} />
      </p>

      <p>
        <Link to={generatePath(paths.account.send, { address })}>
          {t('view_AccountOverview_send')}
        </Link>
      </p>
      <p>
        <Link to={generatePath(paths.account.receive, { address })}>
          {t('view_AccountOverview_receive')}
        </Link>
      </p>

      <Stats accounts={accounts} />
    </main>
  );
}
