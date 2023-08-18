import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { Fragment } from 'react';

import './App.css';
import * as styles from './App.module.css';

import { RouteExcept } from '../../components/RouteExcept/RouteExcept';
import { useInitialEntries } from '../../utilities/popups/useInitialEntries';
import { ConfigurationProvider } from '../../configuration/ConfigurationContext';
import { IdentitiesProvider } from '../../utilities/identities/IdentitiesContext';
import { CredentialsProvider } from '../../utilities/credentials/CredentialsContext';
import { GenericError } from '../GenericError/GenericError';
import { AddIdentity } from '../../components/AddIdentity/AddIdentity';
import { Settings } from '../../components/Settings/Settings';
import { ExternalAccess } from '../ExternalAccess/ExternalAccess';
import { Welcome } from '../Welcome/Welcome';
import { IdentitiesRouter } from '../IdentitiesRouter/IdentitiesRouter';
import { PopupsRouter } from '../PopupsRouter/PopupsRouter';
import { AppSettings } from '../AppSettings/AppSettings';

import { paths } from '../paths';
import { ApiProvider } from '../../utilities/initKiltSDK/ApiProvider';
import { useIdentities } from '../../utilities/identities/identities';
import { isInternal } from '../../configuration/variant';

function confirmNavigation(message: string, callback: (ok: boolean) => void) {
  const allowed = window.confirm(message);
  callback(allowed);
}

export function App() {
  const initialEntries = useInitialEntries();

  const popupPaths = [
    paths.popup.base,
    paths.popup.signDid.start,
    paths.popup.claim,
    paths.popup.signDidExtrinsic,
  ];

  // Without this workaround the IdentitiesRouter will never load identities, seems like a library bug
  useIdentities().data;

  return (
    <GenericError>
      <MemoryRouter
        initialEntries={initialEntries}
        getUserConfirmation={confirmNavigation}
      >
        <RouteExcept path={popupPaths}>
          <Fragment>
            <nav className={styles.menus}>
              <AddIdentity />
              <Settings />
            </nav>
          </Fragment>
        </RouteExcept>

        <Switch>
          <Route path={paths.settings}>
            <AppSettings />
          </Route>

          <Route path={paths.access}>
            <ExternalAccess />
          </Route>

          <ApiProvider>
            <Route path={paths.home} exact>
              <Welcome />
            </Route>

            <Route path={paths.identity.base}>
              <IdentitiesRouter />
            </Route>

            <Route path={paths.popup.base}>
              <PopupsRouter />
            </Route>
          </ApiProvider>
        </Switch>
      </MemoryRouter>
    </GenericError>
  );
}

export function AppWithProviders() {
  return (
    <div className={isInternal ? styles.containerInternal : styles.container}>
      <ConfigurationProvider>
        <IdentitiesProvider>
          <CredentialsProvider>
            <App />
          </CredentialsProvider>
        </IdentitiesProvider>
      </ConfigurationProvider>
    </div>
  );
}
