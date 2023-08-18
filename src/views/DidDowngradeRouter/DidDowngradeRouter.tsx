import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';
import { DidDowngrade } from '../DidDowngrade/DidDowngrade';
import { DidDowngradeWarningCredentials } from '../DidDowngradeWarningCredentials/DidDowngradeWarningCredentials';
import { DidDowngradeWarningWeb3Name } from '../DidDowngradeWarningWeb3Name/DidDowngradeWarningWeb3Name';

interface Props {
  identity: Identity;
}

export function DidDowngradeRouter({ identity }: Props) {
  return (
    <Switch>
      <Route path={paths.identity.did.manage.downgrade.sign}>
        <DidDowngrade identity={identity} />
      </Route>
      <Route path={paths.identity.did.manage.downgrade.warning.credentials}>
        <DidDowngradeWarningCredentials identity={identity} />
      </Route>
      <Route path={paths.identity.did.manage.downgrade.warning.web3name}>
        <DidDowngradeWarningWeb3Name identity={identity} />
      </Route>
    </Switch>
  );
}
