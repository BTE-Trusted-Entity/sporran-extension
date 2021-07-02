import { useEffect } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';

import {
  IdentitiesMap,
  NEW,
  setCurrentIdentity,
  useIdentities,
} from '../../utilities/identities/identities';
import { ReceiveToken } from '../ReceiveToken/ReceiveToken';
import { Welcome } from '../Welcome/Welcome';
import { CreateIdentity } from '../CreateIdentity/CreateIdentity';
import { ImportIdentity } from '../ImportIdentity/ImportIdentity';
import { IdentityOverview } from '../IdentityOverview/IdentityOverview';
import { ResetIdentity } from '../ResetIdentity/ResetIdentity';
import { RemoveIdentity } from '../RemoveIdentity/RemoveIdentity';
import { SendTokenFlow } from '../SendTokenFlow/SendTokenFlow';
import { IdentityCredentials } from '../IdentityCredentials/IdentityCredentials';
import { UnlockVestedFunds } from '../UnlockVestedFunds/UnlockVestedFunds';
import { paths } from '../paths';

interface Props {
  identities: IdentitiesMap;
}

export function SpecificIdentityRouter({ identities }: Props): JSX.Element {
  const { address } = useParams() as { address: string };

  useEffect(() => {
    if (address in identities) {
      setCurrentIdentity(address);
    }
  }, [address, identities]);

  const isNew = address === NEW.address;
  const identity = isNew ? NEW : identities[address];
  if (!identity) {
    return <Redirect to={paths.home} />;
  }

  return (
    <>
      <Switch>
        <Route path={paths.identity.receive}>
          <ReceiveToken identity={identity} />
        </Route>

        <Route path={paths.identity.send.start}>
          <SendTokenFlow identity={identity} />
        </Route>

        <Route path={paths.identity.credentials}>
          <IdentityCredentials identity={identity} />
        </Route>

        <Route path={paths.identity.remove}>
          <RemoveIdentity identity={identity} />
        </Route>

        <Route path={paths.identity.reset.start}>
          <ResetIdentity identity={identity} />
        </Route>

        <Route path={paths.identity.vest}>
          <UnlockVestedFunds identity={identity} />
        </Route>

        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </Switch>
    </>
  );
}

export function IdentitiesRouter(): JSX.Element {
  const identities = useIdentities();

  return (
    <Switch>
      <Route path={paths.identity.add}>
        <Welcome again />
      </Route>

      <Route path={paths.identity.create.start}>
        <CreateIdentity />
      </Route>

      <Route path={paths.identity.import.start}>
        <ImportIdentity />
      </Route>

      <Route path={paths.identity.overview}>
        {identities.data && (
          <SpecificIdentityRouter identities={identities.data} />
        )}
      </Route>
    </Switch>
  );
}
