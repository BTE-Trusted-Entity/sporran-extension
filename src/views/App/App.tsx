import { MemoryRouter, Route, Switch } from 'react-router-dom';

import { AccountsProvider } from '../../utilities/accounts/AccountsContext';
import { AddAccount } from '../../components/AddAccount/AddAccount';
import { Settings } from '../../components/Settings/Settings';
import { Welcome } from '../Welcome/Welcome';
import { AccountsRouter } from '../AccountsRouter/AccountsRouter';

import { paths } from '../paths';

import './App.css';
import styles from './App.module.css';

export function App(): JSX.Element {
  return (
    <div className={styles.container}>
      <MemoryRouter>
        <nav className={styles.menus}>
          <AddAccount />
          <Settings />
        </nav>
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

export function AppWithProviders(): JSX.Element {
  return (
    <AccountsProvider>
      <App />
    </AccountsProvider>
  );
}
