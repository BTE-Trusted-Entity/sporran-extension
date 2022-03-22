import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { DidUpgradeExplainer } from '../DidUpgradeExplainer/DidUpgradeExplainer';
import { DidUpgrade } from '../DidUpgrade/DidUpgrade';
import { paths } from '../paths';
import { DidUpgradePromo } from '../DidUpgradePromo/DidUpgradePromo';

interface Props {
  identity: Identity;
}

export function DidUpgradeFlow({ identity }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.upgrade.sign}>
        <DidUpgrade identity={identity} />
      </Route>
      <Route path={paths.identity.did.upgrade.promo}>
        <DidUpgradePromo identity={identity} />
      </Route>
      <Route path={paths.identity.did.upgrade.start}>
        <DidUpgradeExplainer identity={identity} />
      </Route>
    </Switch>
  );
}
