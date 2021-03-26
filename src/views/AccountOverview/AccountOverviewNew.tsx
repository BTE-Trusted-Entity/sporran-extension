import { browser } from 'webextension-polyfill-ts';
import { useRouteMatch } from 'react-router-dom';

import { plural } from '../../utilities/plural/plural';
import { AccountsMap, NEW } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { Stats } from '../../components/Stats/Stats';

interface Props {
  accounts: AccountsMap;
}

export function AccountOverviewNew({ accounts }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();

  const accountsNumber = Object.values(accounts).length;

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

      <AccountsCarousel path={path} account={NEW} accounts={accounts} />

      <Stats accounts={accounts} />
    </main>
  );
}
