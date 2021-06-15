import { Switch, Route } from 'react-router-dom';

import { Account } from '../../utilities/accounts/types';
import { paths, generatePath } from '../paths';

import { ExistentialWarning } from '../ExistentialWarning/ExistentialWarning';
import { UnlockVestedFunds } from '../UnlockVestedFunds/UnlockVestedFunds';

interface Props {
  account: Account;
}

export function VestingRouter({ account }: Props): JSX.Element {
  const { address } = account;

  const signPath = generatePath(paths.account.vest.sign, { address });
  const warningPath = generatePath(paths.account.vest.warning, { address });

  return (
    <Switch>
      <Route path={signPath}>
        <UnlockVestedFunds account={account} />
      </Route>

      <Route path={warningPath}>
        <ExistentialWarning nextPath={signPath} />
      </Route>
    </Switch>
  );
}
