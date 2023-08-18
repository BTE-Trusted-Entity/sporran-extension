import { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import {
  encryptIdentity,
  Identity,
} from '../../utilities/identities/identities';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { generatePath, paths } from '../paths';

export function ResetIdentity({ identity }: { identity: Identity }) {
  const { address } = identity;
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();

  const onImport = useCallback(
    (phrase: string) => {
      setBackupPhrase(phrase);
      history.push(generatePath(paths.identity.reset.password, { address }));
    },
    [history, address],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      await encryptIdentity(backupPhrase, password);
      history.push(
        generatePath(paths.identity.overview, { address, type: 'pwreset' }),
      );
    },
    [backupPhrase, history, address],
  );

  return (
    <Switch>
      <Route path={generatePath(paths.identity.reset.start, { address })} exact>
        <ImportBackupPhrase
          type="reset"
          address={address}
          onImport={onImport}
        />
      </Route>
      <Route path={generatePath(paths.identity.reset.password, { address })}>
        <CreatePassword onSuccess={onSuccess} />
      </Route>
    </Switch>
  );
}
