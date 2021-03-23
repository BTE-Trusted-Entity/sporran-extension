import { MemoryRouter, Route, Switch } from 'react-router-dom';

import { Welcome } from '../Welcome/Welcome';
import { AccountsRouter } from '../AccountsRouter/AccountsRouter';
import { paths } from '../paths';

import styles from './App.module.css';
import { AddAccount } from '../../components/AddAccount/AddAccount';

export function App(): JSX.Element {
  return (
    <div className={styles.container}>
      <MemoryRouter>
        {hasAccounts && <AddAccount />}
        <Switch>
          <Route path={paths.home} exact>
            <Welcome />
          </Route>

          <Route path={paths.account.base}>
            <AccountsRouter />
          </Route>
        </Switch>
      </MemoryRouter>
    </div>
  );
}
