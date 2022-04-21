import { useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { generatePath, paths } from '../paths';
import { Identity } from '../../utilities/identities/types';
import { W3NCreateInfo } from '../W3NCreateInfo/W3NCreateInfo';
import { W3NCreateForm } from '../W3NCreateForm/W3NCreateForm';
import { W3NCreateSign } from '../W3NCreateSign/W3NCreateSign';
import { W3NCreatePromo } from '../W3NCreatePromo/W3NCreatePromo';

interface Props {
  identity: Identity;
}

export function W3NCreateFlow({ identity }: Props): JSX.Element {
  const { address } = identity;

  const history = useHistory();

  const handleSubmit = useCallback(
    (web3name: string) => {
      history.push(
        generatePath(paths.identity.did.web3name.create.sign, {
          address,
          web3name,
        }),
      );
    },
    [address, history],
  );

  const handlePromoSubmit = useCallback(
    (web3name: string) => {
      history.push(
        generatePath(paths.identity.did.web3name.create.promo.sign, {
          address,
          web3name,
        }),
      );
    },
    [address, history],
  );

  return (
    <Switch>
      <Route path={paths.identity.did.web3name.create.form}>
        <W3NCreateForm identity={identity} onSubmit={handleSubmit} />
      </Route>
      <Route path={paths.identity.did.web3name.create.promo.form}>
        <W3NCreateForm identity={identity} onSubmit={handlePromoSubmit} />
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
