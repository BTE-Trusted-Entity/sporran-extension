import { MemoryRouter, Switch, Route } from 'react-router-dom';

import { Welcome } from '../Welcome/Welcome';
import { CreateAccount } from '../CreateAccount/CreateAccount';
import { ImportAccount } from '../ImportAccount/ImportAccount';

import styles from './App.module.css';

export function App(): JSX.Element {
  return (
    <main className={styles.container}>
      <MemoryRouter>
        <Switch>
          <Route path="/" exact>
            <Welcome />
          </Route>
          <Route path="/account/create">
            <CreateAccount />
          </Route>
          <Route path="/account/import">
            <ImportAccount />
          </Route>
        </Switch>
      </MemoryRouter>
    </main>
  );
}
