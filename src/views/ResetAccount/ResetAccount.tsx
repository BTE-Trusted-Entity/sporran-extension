import { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Account, encryptAccount } from '../../utilities/accounts/accounts';
import { CreateAccountSuccess } from '../CreateAccountSuccess/CreateAccountSuccess';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { paths, generatePath } from '../paths';

export function ResetAccount({ account }: { account: Account }): JSX.Element {
  const { address } = account;
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();

  const onImport = useCallback(
    (phrase) => {
      setBackupPhrase(phrase);
      history.push(generatePath(paths.account.reset.password, { address }));
    },
    [history, address],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      await encryptAccount(backupPhrase, password);
      history.push(generatePath(paths.account.reset.success, { address }));
    },
    [backupPhrase, history, address],
  );

  return (
    <Switch>
      <Route path={generatePath(paths.account.reset.start, { address })} exact>
        <ImportBackupPhrase
          type="reset"
          address={address}
          onImport={onImport}
        />
      </Route>
      <Route path={generatePath(paths.account.reset.password, { address })}>
        <CreatePassword type="reset" onSuccess={onSuccess} />
      </Route>
      <Route path={generatePath(paths.account.reset.success, { address })}>
        <CreateAccountSuccess type="reset" address={address} />
      </Route>
    </Switch>
  );
}
