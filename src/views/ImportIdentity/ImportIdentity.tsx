import { useCallback, useState } from 'react';
import { generatePath, Route, Switch, useHistory } from 'react-router-dom';

import { createIdentity } from '../../utilities/identities/identities';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { paths } from '../paths';

export function ImportIdentity(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();

  const onImport = useCallback(
    (phrase) => {
      setBackupPhrase(phrase);
      history.push(paths.identity.import.password);
    },
    [history],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      const { address } = await createIdentity(backupPhrase, password);
      history.push(
        generatePath(paths.identity.overview, { address, type: 'imported' }),
      );
    },
    [backupPhrase, history],
  );

  return (
    <Switch>
      <Route path={paths.identity.import.start} exact>
        <ImportBackupPhrase onImport={onImport} />
      </Route>
      <Route path={paths.identity.import.password}>
        <CreatePassword onSuccess={onSuccess} />
      </Route>
    </Switch>
  );
}
