import { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { generatePath, paths } from '../paths';
import { Identity } from '../../utilities/identities/types';
import { W3NCreateInfo } from '../W3NCreateInfo/W3NCreateInfo';
import { W3NCreateForm } from '../W3NCreateForm/W3NCreateForm';
import { W3NCreateSign } from '../W3NCreateSign/W3NCreateSign';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';
import { W3NCreatePromo } from '../W3NCreatePromo/W3NCreatePromo';

interface Props {
  identity: Identity;
}

export function W3NCreateFlow({ identity }: Props): JSX.Element {
  const { address } = identity;

  const hasPromo = useBooleanState();

  const history = useHistory();
  const [web3name, setWeb3name] = useState('');

  const path = hasPromo.current
    ? generatePath(paths.identity.did.web3name.create.promo, { address })
    : generatePath(paths.identity.did.web3name.create.sign, { address });

  const handleSubmit = useCallback(
    (web3name: string) => {
      setWeb3name(web3name);
      history.push(path);
    },
    [path, history],
  );

  return (
    <Switch>
      <Route path={paths.identity.did.web3name.create.form}>
        <W3NCreateForm identity={identity} onSubmit={handleSubmit} />
      </Route>
      <Route path={paths.identity.did.web3name.create.sign}>
        <W3NCreateSign identity={identity} web3name={web3name} />
      </Route>
      <Route path={paths.identity.did.web3name.create.promo}>
        <W3NCreatePromo identity={identity} web3name={web3name} />
      </Route>
      <Route path={paths.identity.did.web3name.create.info}>
        <W3NCreateInfo
          identity={identity}
          hasPromo={hasPromo.current}
          togglePromo={hasPromo.toggle}
        />
      </Route>
    </Switch>
  );
}
