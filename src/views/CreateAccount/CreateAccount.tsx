import { useEffect, useState, useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Identity } from '@kiltprotocol/core';
import { ClipLoader } from 'react-spinners';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';
import { CreateAccountSuccess } from '../CreateAccountSuccess/CreateAccountSuccess';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { saveEncrypted } from '../../utilities/storageEncryption/storageEncryption';
import { VerifyBackupPhrase } from '../VerifyBackupPhrase/VerifyBackupPhrase';
import { paths } from '../paths';

export function CreateAccount(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const [address, setAddress] = useState('');
  const history = useHistory();

  useEffect(() => {
    setBackupPhrase(Identity.generateMnemonic());
  }, []);

  const onSuccess = useCallback(
    async (password: string) => {
      const { address, seed } = Identity.buildFromMnemonic(backupPhrase);
      await saveEncrypted(address, password, seed);
      setAddress(address);

      history.push(paths.account.create.success);
    },
    [backupPhrase, history],
  );

  if (!backupPhrase) {
    return <ClipLoader />;
  }

  return (
    <Switch>
      <Route path={paths.account.create.start} exact>
        <Warning />
      </Route>
      <Route path={paths.account.create.backup}>
        <SaveBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path={paths.account.create.verify}>
        <VerifyBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path={paths.account.create.password}>
        <CreatePassword onSuccess={onSuccess} />
      </Route>
      <Route path={paths.account.create.success}>
        <CreateAccountSuccess address={address} />
      </Route>
    </Switch>
  );
}
