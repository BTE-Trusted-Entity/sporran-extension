import { browser } from 'webextension-polyfill-ts';
import { useRouteMatch } from 'react-router-dom';

import { plural } from '../../utilities/plural/plural';
import { NEW, useAccounts } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { Stats } from '../../components/Stats/Stats';

export function AccountOverviewNew(): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();

  const accounts = useAccounts().data;
  if (!accounts) {
    return null;
  }

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

      <AccountsCarousel path={path} account={NEW} />

      <Stats />
    </main>
  );
}
