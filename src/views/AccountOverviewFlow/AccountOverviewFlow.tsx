import { Switch, Route } from 'react-router-dom';

import { Account } from '../../utilities/accounts/types';

import { ExistentialWarning } from '../ExistentialWarning/ExistentialWarning';
import { paths, generatePath } from '../paths';
import { AccountOverview } from '../AccountOverview/AccountOverview';
import { UnlockVestedFunds } from '../UnlockVestedFunds/UnlockVestedFunds';

interface Props {
  account: Account;
}

export function AccountOverviewFlow({ account }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.account.vest.sign}>
        <UnlockVestedFunds account={account} />
      </Route>

      <Route
        path={generatePath(paths.account.vest.warning, {
          address: account.address,
        })}
      >
        <ExistentialWarning
          path={generatePath(paths.account.vest.sign, {
            address: account.address,
          })}
        />
      </Route>

      <Route path={paths.account.overview}>
        <AccountOverview account={account} />
      </Route>
    </Switch>
  );
}
