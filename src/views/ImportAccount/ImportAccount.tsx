import React, { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { SuccessTypes } from '../../utilities/accounts/types';
import { createAccount, NEW } from '../../utilities/accounts/accounts';
import { AccountOverview } from '../AccountOverview/AccountOverview';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { paths } from '../paths';

export function ImportAccount(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const [account, setAccount] = useState(NEW);
  const history = useHistory();

  const onImport = useCallback(
    (phrase) => {
      setBackupPhrase(phrase);
      history.push(paths.account.import.password);
    },
    [history],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      const account = await createAccount(backupPhrase, password);
      setAccount(account);
      history.push(paths.account.import.overview);
    },
    [backupPhrase, history],
  );

  return (
    <Switch>
      <Route path={paths.account.import.start} exact>
        <ImportBackupPhrase onImport={onImport} />
      </Route>
      <Route path={paths.account.import.password}>
        <CreatePassword onSuccess={onSuccess} />
      </Route>
      <Route path={paths.account.import.overview}>
        <AccountOverview
          account={account}
          hasSuccessOverlay={SuccessTypes.imported}
        />
      </Route>
    </Switch>
  );
}
