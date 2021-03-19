import { browser } from 'webextension-polyfill-ts';
import { Redirect, Route, Switch } from 'react-router-dom';

import { plural } from '../../utilities/plural/plural';
import {
  AccountsMap,
  useCurrentAccount,
} from '../../utilities/accounts/accounts';
import { Account } from '../Account/Account';

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
            path="/account/:address"
            render={({ match }) => {
              const account = accounts[match.params.address];
              return account ? (
                <Account account={account} />
              ) : (
                <Redirect to="/" />
              );
            }}
          />
          <Route>
            {current.data && <Account account={accounts[current.data]} />}
          </Route>
        </Switch>

        <p>1 account - Total balance: 0.0000 K</p>
      </header>
    </main>
  );
}
