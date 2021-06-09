import { MemoryRouter, Route, Switch } from 'react-router-dom';

import { useInitialEntries } from '../../utilities/popups/useInitialEntries';
import { ConfigurationProvider } from '../../configuration/ConfigurationContext';
import { useConfiguration } from '../../configuration/useConfiguration';
import { AccountsProvider } from '../../utilities/accounts/AccountsContext';
import { AddAccount } from '../../components/AddAccount/AddAccount';
import { Settings } from '../../components/Settings/Settings';
import { ExternalAccess } from '../ExternalAccess/ExternalAccess';
import { Welcome } from '../Welcome/Welcome';
import { AccountsRouter } from '../AccountsRouter/AccountsRouter';
import { PopupsRouter } from '../PopupsRouter/PopupsRouter';
import { AppSettings } from '../AppSettings/AppSettings';

import { paths } from '../paths';

import './App.css';
import styles from './App.module.css';

export function App(): JSX.Element {
  const initialEntries = useInitialEntries();
  const { features } = useConfiguration();

  return (
    <div className={styles.container}>
      <MemoryRouter initialEntries={initialEntries}>
        <nav className={styles.menus}>
          <AddAccount />
          <Settings />
        </nav>
        <Switch>
          <Route path={paths.home} exact>
            <Welcome />
          </Route>

          {features.endpoint && (
            <Route path={paths.settings}>
              <AppSettings />
            </Route>
          )}

          <Route path={paths.access}>
            <ExternalAccess />
          </Route>

          <Route path={paths.account.base}>
            <AccountsRouter />
          </Route>

          <Route path={paths.popup.base}>
            <PopupsRouter />
          </Route>
        </Switch>
      </MemoryRouter>
    </div>
  );
}

export function AppWithProviders(): JSX.Element {
  return (
    <ConfigurationProvider>
      <AccountsProvider>
        <App />
      </AccountsProvider>
    </ConfigurationProvider>
  );
}
