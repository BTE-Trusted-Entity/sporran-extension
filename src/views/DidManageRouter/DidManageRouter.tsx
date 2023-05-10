import { JSX } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { DidEndpointsFlow } from '../DidEndpointsFlow/DidEndpointsFlow';
import { DidManage } from '../DidManage/DidManage';
import { paths } from '../paths';
import { DidDowngradeRouter } from '../DidDowngradeRouter/DidDowngradeRouter';

interface Props {
  identity: Identity;
}

export function DidManageRouter({ identity }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.manage.downgrade.base}>
        <DidDowngradeRouter identity={identity} />
      </Route>

      <Route path={paths.identity.did.manage.endpoints.start}>
        <DidEndpointsFlow identity={identity} />
      </Route>

      <Route path={paths.identity.did.manage.start}>
        <DidManage identity={identity} />
      </Route>
    </Switch>
  );
}
