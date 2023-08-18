import { useCallback, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { DidServiceEndpoint } from '@kiltprotocol/sdk-js';

import { Identity } from '../../utilities/identities/types';
import { DidEndpointsForm } from '../DidEndpointsForm/DidEndpointsForm';
import { DidEndpointsSign } from '../DidEndpointsSign/DidEndpointsSign';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidEndpointsFlow({ identity }: Props) {
  const history = useHistory();

  const [type, setType] = useState<'add' | 'remove'>('add');
  const [values, setValues] = useState<DidServiceEndpoint | undefined>();

  const { address } = identity;
  const signPath = generatePath(paths.identity.did.manage.endpoints.sign, {
    address,
  });

  const onAdd = useCallback(
    async (endpoint: DidServiceEndpoint) => {
      setType('add');
      setValues(endpoint);
      history.push(signPath);
    },
    [history, signPath],
  );

  const onRemove = useCallback(
    async (endpoint: DidServiceEndpoint) => {
      setType('remove');
      setValues(endpoint);
      history.push(signPath);
    },
    [history, signPath],
  );

  return (
    <Switch>
      <Route path={paths.identity.did.manage.endpoints.sign}>
        {values && (
          <DidEndpointsSign identity={identity} type={type} endpoint={values} />
        )}
        {!values && (
          <Redirect
            to={generatePath(paths.identity.did.manage.endpoints.edit, {
              address,
            })}
          />
        )}
      </Route>
      <Route path={paths.identity.did.manage.endpoints.edit}>
        <DidEndpointsForm
          identity={identity}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </Route>
    </Switch>
  );
}
