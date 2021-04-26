import { useCallback, useState } from 'react';
import { generatePath, Route, Switch, useHistory } from 'react-router-dom';

import { createAccount } from '../../utilities/accounts/accounts';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { paths } from '../paths';

export function ImportAccount(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
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
      const { address } = await createAccount(backupPhrase, password);
      history.push(
        generatePath(paths.account.overview, { address, type: 'imported' }),
      );
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
    </Switch>
  );
}
