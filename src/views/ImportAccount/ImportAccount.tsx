import { Identity } from '@kiltprotocol/core';
import { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { saveEncrypted } from '../../utilities/storageEncryption/storageEncryption';
import { CreateAccountSuccess } from '../CreateAccountSuccess/CreateAccountSuccess';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';

export function ImportAccount(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();

  const onImport = useCallback(
    (phrase) => {
      setBackupPhrase(phrase);

      history.push('/account/import/password');
    },
    [history],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      const { address, seed } = Identity.buildFromMnemonic(backupPhrase);
      await saveEncrypted(address, password, seed);
      history.push('/account/import/success');
    },
    [backupPhrase, history],
  );

  return (
    <Switch>
      <Route path="/account/import" exact>
        <ImportBackupPhrase importBackupPhrase={onImport} />
      </Route>
      <Route path="/account/import/password">
        <CreatePassword onSuccess={onSuccess} />
      </Route>
      <Route path="/account/import/success">
        <CreateAccountSuccess />
      </Route>
    </Switch>
  );
}
