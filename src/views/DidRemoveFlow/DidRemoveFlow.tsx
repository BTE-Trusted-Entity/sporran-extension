import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidRemoveFlow({}: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.remove.sign}>
        {/* TODO: SK-436
        <DidRemove identity={identity} /> */}
      </Route>
      <Route path={paths.identity.did.remove.start}>
        {/* TODO: SK-461
        <DidRemoveExplainer identity={identity} /> */}
      </Route>
    </Switch>
  );
}
