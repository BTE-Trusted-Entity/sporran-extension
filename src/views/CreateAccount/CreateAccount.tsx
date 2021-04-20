import React, { useEffect, useState, useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Identity } from '@kiltprotocol/core';
import { ClipLoader } from 'react-spinners';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { createAccount, NEW } from '../../utilities/accounts/accounts';
import { VerifyBackupPhrase } from '../VerifyBackupPhrase/VerifyBackupPhrase';
import { paths } from '../paths';
import { AccountOverview } from '../AccountOverview/AccountOverview';
import { SuccessTypes } from '../../utilities/accounts/types';

export function CreateAccount(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const [account, setAccount] = useState(NEW);
  const history = useHistory();
  useEffect(() => {
    setBackupPhrase(Identity.generateMnemonic());
  }, []);

  const onSuccess = useCallback(
    async (password: string) => {
      const account = await createAccount(backupPhrase, password);
      setAccount(account);
      history.push(paths.account.create.overview);
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
      <Route path={paths.account.create.overview}>
        <AccountOverview
          account={account}
          hasSuccessOverlay={SuccessTypes.created}
        />
      </Route>
    </Switch>
  );
}
