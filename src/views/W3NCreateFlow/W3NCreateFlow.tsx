import { Route, Switch } from 'react-router-dom';

import { paths } from '../paths';
import { Identity } from '../../utilities/identities/types';
import { W3NCreateInfo } from '../W3NCreateInfo/W3NCreateInfo';
import { W3NCreateForm } from '../W3NCreateForm/W3NCreateForm';
import { W3NCreateSign } from '../W3NCreateSign/W3NCreateSign';
import { W3NCreatePromo } from '../W3NCreatePromo/W3NCreatePromo';

interface Props {
  identity: Identity;
}

export function W3NCreateFlow({ identity }: Props): JSX.Element {
  return (
    <Switch>
      <Route path={paths.identity.did.web3name.create.form}>
        <W3NCreateForm
          identity={identity}
          signPath={paths.identity.did.web3name.create.sign}
        />
      </Route>
      <Route path={paths.identity.did.web3name.create.promo.form}>
        <W3NCreateForm
          identity={identity}
          signPath={paths.identity.did.web3name.create.promo.sign}
        />
      </Route>
      <Route path={paths.identity.did.web3name.create.sign}>
        <W3NCreateSign identity={identity} />
      </Route>
      <Route path={paths.identity.did.web3name.create.promo.sign}>
        <W3NCreatePromo identity={identity} />
      </Route>
      <Route path={paths.identity.did.web3name.create.info}>
        <W3NCreateInfo identity={identity} />
      </Route>
    </Switch>
  );
}
