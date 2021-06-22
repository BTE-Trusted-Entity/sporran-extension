import { MemoryRouter, Route, Switch } from 'react-router-dom';

import { RouteExcept } from '../../components/RouteExcept/RouteExcept';
import { useInitialEntries } from '../../utilities/popups/useInitialEntries';
import { ConfigurationProvider } from '../../configuration/ConfigurationContext';
import { useConfiguration } from '../../configuration/useConfiguration';
import { IdentitiesProvider } from '../../utilities/identities/IdentitiesContext';
import { AddIdentity } from '../../components/AddIdentity/AddIdentity';
import { Settings } from '../../components/Settings/Settings';
import { ExternalAccess } from '../ExternalAccess/ExternalAccess';
import { Welcome } from '../Welcome/Welcome';
import { IdentitiesRouter } from '../IdentitiesRouter/IdentitiesRouter';
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
        <RouteExcept path={paths.popup.base}>
          <nav className={styles.menus}>
            <AddIdentity />
            <Settings />
          </nav>
        </RouteExcept>

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

          <Route path={paths.identity.base}>
            <IdentitiesRouter />
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
      <IdentitiesProvider>
        <App />
      </IdentitiesProvider>
    </ConfigurationProvider>
  );
}
