import { Switch, Route } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { DidDowngrade } from '../DidDowngrade/DidDowngrade';
import { DidDowngradeWarning } from '../DidDowngradeWarning/DidDowngradeWarning';
import { DidEndpointsFlow } from '../DidEndpointsFlow/DidEndpointsFlow';
import { DidManage } from '../DidManage/DidManage';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidManageRouter({ identity }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.manage.downgrade}>
        <DidDowngrade identity={identity} />
      </Route>

      <Route path={paths.identity.did.manage.warning}>
        <DidDowngradeWarning identity={identity} />
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
