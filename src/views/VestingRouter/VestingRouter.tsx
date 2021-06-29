import { Switch, Route } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths, generatePath } from '../paths';

import { ExistentialWarning } from '../ExistentialWarning/ExistentialWarning';
import { UnlockVestedFunds } from '../UnlockVestedFunds/UnlockVestedFunds';

interface Props {
  identity: Identity;
}

export function VestingRouter({ identity }: Props): JSX.Element {
  const { address } = identity;

  const signPath = generatePath(paths.identity.vest.sign, { address });
  const warningPath = generatePath(paths.identity.vest.warning, { address });

  return (
    <Switch>
      <Route path={signPath}>
        <UnlockVestedFunds identity={identity} />
      </Route>

      <Route path={warningPath}>
        <ExistentialWarning nextPath={signPath} />
      </Route>
    </Switch>
  );
}
