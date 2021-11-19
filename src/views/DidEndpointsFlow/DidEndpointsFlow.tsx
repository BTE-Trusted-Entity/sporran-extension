import { useCallback, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { IDidServiceEndpoint } from '@kiltprotocol/types';
import { DidUtils, FullDidDetails } from '@kiltprotocol/did';

import { Identity } from '../../utilities/identities/types';
import { queryFullDetailsFromIdentifier } from '../../utilities/did/did';
import { exceptionToError } from '../../utilities/exceptionToError/exceptionToError';
import { DidEndpointsForm } from '../DidEndpointsForm/DidEndpointsForm';
import { DidEndpointsSign } from '../DidEndpointsSign/DidEndpointsSign';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidEndpointsFlow({ identity }: Props): JSX.Element {
  const history = useHistory();

  const [type, setType] = useState<'add' | 'remove'>('add');
  const [values, setValues] = useState<IDidServiceEndpoint | undefined>();

  const [didDetails, setDidDetails] = useState<FullDidDetails | undefined>();
  const [endpoints, setEndpoints] = useState<
    IDidServiceEndpoint[] | undefined
  >();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const details = await queryFullDetailsFromIdentifier(
          DidUtils.parseDidUrl(identity.did).identifier,
        );
        if (!details) {
          throw new Error(`Could not resolve DID ${identity.did}`);
        }
        setDidDetails(details);
        setEndpoints(details.getEndpoints());
      } catch (exception) {
        setError(exceptionToError(exception));
      }
    })();
  }, [identity.did]);

  const { address } = identity;
  const signPath = generatePath(paths.identity.did.endpoints.sign, { address });

  const onAdd = useCallback(
    async (endpoint) => {
      setType('add');
      setValues(endpoint);
      history.push(signPath);
    },
    [history, signPath],
  );

  const onRemove = useCallback(
    async (endpoint) => {
      setType('remove');
      setValues(endpoint);
      history.push(signPath);
    },
    [history, signPath],
  );

  if (error) {
    throw error; // TODO: can we even handle that?
  }

  return (
    <Switch>
      <Route path={paths.identity.did.endpoints.sign}>
        {didDetails && values && (
          <DidEndpointsSign
            identity={identity}
            type={type}
            endpoint={values}
            fullDidDetails={didDetails}
          />
        )}
      </Route>
      <Route path={paths.identity.did.endpoints.start}>
        <DidEndpointsForm
          identity={identity}
          endpoints={endpoints}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </Route>
    </Switch>
  );
}
