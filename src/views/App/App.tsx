import { useEffect } from 'react';
import { init } from '@kiltprotocol/core';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

import { Welcome } from '../Welcome/Welcome';
import { CreateAccount } from '../CreateAccount/CreateAccount';
import { ImportAccount } from '../ImportAccount/ImportAccount';
import { Accounts } from '../Accounts/Accounts';
import { useAccounts } from '../../utilities/accounts/accounts';

import styles from './App.module.css';

export function App(): JSX.Element {
  const accounts = useAccounts();
  const hasAccounts = accounts.data && Object.values(accounts.data).length > 0;

  useEffect(() => {
    (async () => {
      // TODO: move address to config file
      await init({ address: 'wss://full-nodes.kilt.io:9944' });
    })();
  }, []);

  return (
    <main className={styles.container}>
      <MemoryRouter>
        <Switch>
          <Route path="/" exact>
            {accounts.data &&
              (hasAccounts ? (
                <Accounts accounts={accounts.data} />
              ) : (
                <Welcome />
              ))}
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
