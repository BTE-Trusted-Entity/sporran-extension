import { Identity } from '@kiltprotocol/core';
import { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { saveEncrypted } from '../../utilities/storageEncryption/storageEncryption';
import { CreateAccountSuccess } from '../CreateAccountSuccess/CreateAccountSuccess';
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
      const { address, seed } = Identity.buildFromMnemonic(backupPhrase);
      await saveEncrypted(address, password, seed);
      history.push(paths.account.import.success);
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
      <Route path={paths.account.import.success}>
        <CreateAccountSuccess type="import" />
      </Route>
    </Switch>
  );
}
