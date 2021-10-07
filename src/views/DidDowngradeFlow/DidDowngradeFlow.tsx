import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';

import { DidDowngradeExplainer } from '../DidDowngradeExplainer/DidDowngradeExplainer';
import { DidDowngrade } from '../DidDowngrade/DidDowngrade';

interface Props {
  identity: Identity;
}

export function DidDowngradeFlow({ identity }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.downgrade.sign}>
        <DidDowngrade identity={identity} />
      </Route>
      <Route path={paths.identity.did.downgrade.start}>
        <DidDowngradeExplainer identity={identity} />
      </Route>
    </Switch>
  );
}
