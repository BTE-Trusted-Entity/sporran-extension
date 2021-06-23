import { useEffect, useState, useCallback } from 'react';
import { generatePath, Route, Switch, useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { Identity } from '@kiltprotocol/core';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { createIdentity } from '../../utilities/identities/identities';
import { VerifyBackupPhrase } from '../VerifyBackupPhrase/VerifyBackupPhrase';
import { paths } from '../paths';

export function CreateIdentity(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();
  useEffect(() => {
    setBackupPhrase(Identity.generateMnemonic());
  }, []);

  const onSuccess = useCallback(
    async (password: string) => {
      const { address } = await createIdentity(backupPhrase, password);

      history.push(
        generatePath(paths.identity.overview, { address, type: 'created' }),
      );
    },
    [backupPhrase, history],
  );

  if (!backupPhrase) {
    return <ClipLoader />;
  }

  return (
    <Switch>
      <Route path={paths.identity.create.start} exact>
        <Warning />
      </Route>
      <Route path={paths.identity.create.backup}>
        <SaveBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path={paths.identity.create.verify}>
        <VerifyBackupPhrase backupPhrase={backupPhrase} />
      </Route>
      <Route path={paths.identity.create.password}>
        <CreatePassword onSuccess={onSuccess} />
      </Route>
    </Switch>
  );
}
