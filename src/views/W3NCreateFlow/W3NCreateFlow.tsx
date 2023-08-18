import { Route, Switch } from 'react-router-dom';

import { paths } from '../paths';
import { Identity } from '../../utilities/identities/types';
import { W3NCreateInfo } from '../W3NCreateInfo/W3NCreateInfo';
import { W3NCreateForm } from '../W3NCreateForm/W3NCreateForm';
import { W3NCreateSign } from '../W3NCreateSign/W3NCreateSign';
import { W3NCreateChoose } from '../W3NCreateChoose/W3NCreateChoose';
import { W3NCreateSignEuro } from '../W3NCreateSignEuro/W3NCreateSignEuro';

interface Props {
  identity: Identity;
}

export function W3NCreateFlow({ identity }: Props) {
  return (
    <Switch>
      <Route path={paths.identity.web3name.create.form}>
        <W3NCreateForm identity={identity} />
      </Route>
      <Route path={paths.identity.web3name.create.choose}>
        <W3NCreateChoose identity={identity} />
      </Route>
      <Route path={paths.identity.web3name.create.kilt}>
        <W3NCreateSign identity={identity} />
      </Route>
      <Route path={paths.identity.web3name.create.euro}>
        <W3NCreateSignEuro identity={identity} />
      </Route>
      <Route path={paths.identity.web3name.create.info}>
        <W3NCreateInfo identity={identity} />
      </Route>
    </Switch>
  );
}
