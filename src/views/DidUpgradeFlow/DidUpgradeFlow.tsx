import { JSX } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { DidUpgradeExplainer } from '../DidUpgradeExplainer/DidUpgradeExplainer';
import { DidUpgrade } from '../DidUpgrade/DidUpgrade';
import { DidUpgradeEuro } from '../DidUpgradeEuro/DidUpgradeEuro';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidUpgradeFlow({ identity }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.upgrade.kilt}>
        <DidUpgrade identity={identity} />
      </Route>
      <Route path={paths.identity.did.upgrade.euro}>
        <DidUpgradeEuro identity={identity} />
      </Route>
      <Route path={paths.identity.did.upgrade.start}>
        <DidUpgradeExplainer identity={identity} />
      </Route>
    </Switch>
  );
}
