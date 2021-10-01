import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidDowngradeFlow({}: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.downgrade.sign}>
        {/* TODO: SK-436
        <DidDowngrade identity={identity} /> */}
      </Route>
      <Route path={paths.identity.did.downgrade.start}>
        {/* TODO: SK-461
        <DidDowngradeExplainer identity={identity} /> */}
      </Route>
    </Switch>
  );
}
