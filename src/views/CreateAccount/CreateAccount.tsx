import { useEffect, useState, useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Identity, init } from '@kiltprotocol/core';
import { ClipLoader } from 'react-spinners';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';
import { CreateAccountSuccess } from '../CreateAccountSuccess/CreateAccountSuccess';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { saveEncrypted } from '../../utilities/storageEncryption/storageEncryption';
import { VerifyBackupPhrase } from '../VerifyBackupPhrase/VerifyBackupPhrase';

export function CreateAccount(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();

  useEffect(() => {
    setBackupPhrase(Identity.generateMnemonic());
  }, []);

  const onSuccess = useCallback(
    async (password: string) => {
      const { address, seed } = Identity.buildFromMnemonic(backupPhrase);
      await saveEncrypted(address, password, seed);

      history.push('/account/create/success');
    },
    [backupPhrase, history],
  );

  if (!backupPhrase) {
    return <ClipLoader />;
  }

  return (
    <Switch>
      <Route path="/account/create" exact>
        <Warning />
      </Route>
      <Route path="/account/create/backup">
        <SaveBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path="/account/create/verify">
        <VerifyBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path="/account/create/password">
        <CreatePassword onSuccess={onSuccess} />
      </Route>
      <Route path="/account/create/success">
        <CreateAccountSuccess />
      </Route>
    </Switch>
  );
}
