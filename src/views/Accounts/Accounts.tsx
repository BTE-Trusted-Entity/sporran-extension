import { browser } from 'webextension-polyfill-ts';
import { Redirect, Route, Switch } from 'react-router-dom';

import { plural } from '../../utilities/plural/plural';
import {
  AccountsMap,
  useCurrentAccount,
} from '../../utilities/accounts/accounts';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { generatePath, paths } from '../paths';

interface Props {
  accounts: AccountsMap;
}

export function Accounts({ accounts }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const accountsNumber = Object.values(accounts).length;
  const current = useCurrentAccount();

  return (
    <main>
      <header>
        <h1>{t('view_Accounts_title')}</h1>
        <p>
          {plural(accountsNumber, {
            one: 'view_Accounts_subtitle_one',
            other: 'view_Accounts_subtitle_other',
          })}
        </p>

        <Switch>
          <Route
            path={paths.account.overview}
            render={({ match }) => {
              const account = accounts[match.params.address as string];
              if (!account) {
                return <Redirect to={paths.home} />;
              }
              return (
                <AccountsCarousel
                  path={match.path}
                  account={account}
                  accounts={accounts}
                />
              );
            }}
          />
          <Route>
            {current.data && (
              <Redirect
                to={generatePath(
                  paths.account.overview,
                  accounts[current.data] as { address: string },
                )}
              />
            )}
          </Route>
        </Switch>

        <p>1 account - Total balance: 0.0000 K</p>
      </header>
    </main>
  );
}
