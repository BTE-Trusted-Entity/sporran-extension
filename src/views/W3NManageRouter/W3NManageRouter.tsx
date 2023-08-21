import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { W3NManage } from '../W3NManage/W3NManage';
import { W3NRemove } from '../W3NRemove/W3NRemove';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

export function W3NManageRouter({ identity }: Props) {
  return (
    <Switch>
      <Route path={paths.identity.web3name.manage.remove}>
        <W3NRemove identity={identity} />
      </Route>

      <Route path={paths.identity.web3name.manage.start}>
        <W3NManage identity={identity} />
      </Route>
    </Switch>
  );
}
