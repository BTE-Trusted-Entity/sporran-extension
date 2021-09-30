import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { DidExplainer } from '../DidExplainer/DidExplainer';
import { DidUpgrade } from '../DidUpgrade/DidUpgrade';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidUpgradeFlow({ identity }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.upgrade}>
        <DidUpgrade identity={identity} />
      </Route>
      <Route path={paths.identity.did.start}>
        <DidExplainer identity={identity} />
      </Route>
    </Switch>
  );
}
