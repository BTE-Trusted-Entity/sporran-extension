import { MemoryRouter, Switch, Route } from 'react-router-dom';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Welcome } from '../Welcome/Welcome';

import styles from './App.module.css';

export function App(): JSX.Element {
  return (
    <main className={styles.container}>
      <MemoryRouter>
        <Switch>
          <Route path="/" exact>
            <Welcome />
          </Route>
          <Route path="/account/create/verify">
            <SaveBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />
          </Route>
        </Switch>
      </MemoryRouter>
    </main>
  );
}
