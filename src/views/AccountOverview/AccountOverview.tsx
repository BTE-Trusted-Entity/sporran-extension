import { browser } from 'webextension-polyfill-ts';
import { Link, useRouteMatch } from 'react-router-dom';

import { plural } from '../../utilities/plural/plural';
import { Account, AccountsMap } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { generatePath, paths } from '../paths';
import { Balance } from '../../components/Balance/Balance';

interface Props {
  account: Account;
  accounts: AccountsMap;
}

export function AccountOverview({ account, accounts }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();

  const accountsNumber = Object.values(accounts).length;
  const { address } = account;

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

      <p>1 account - Total balance: 0.0000 K</p>
    </main>
  );
}
