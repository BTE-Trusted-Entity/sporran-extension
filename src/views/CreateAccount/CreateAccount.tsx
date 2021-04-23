import { useEffect, useState, useCallback } from 'react';
import { generatePath, Route, Switch, useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { Identity } from '@kiltprotocol/core';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { createAccount } from '../../utilities/accounts/accounts';
import { VerifyBackupPhrase } from '../VerifyBackupPhrase/VerifyBackupPhrase';
import { paths } from '../paths';

export function CreateAccount(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();
  useEffect(() => {
    setBackupPhrase(Identity.generateMnemonic());
  }, []);

  const onSuccess = useCallback(
    async (password: string) => {
      const { address } = await createAccount(backupPhrase, password);

      history.push(
        generatePath(paths.account.overview, { address, type: 'created' }),
      );
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
    </Switch>
  );
}
