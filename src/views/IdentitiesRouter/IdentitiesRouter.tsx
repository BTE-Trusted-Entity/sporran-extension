import { JSX, useEffect } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  IdentitiesMap,
  NEW,
  setCurrentIdentity,
  useCurrentIdentity,
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
import { CreatePresentation } from '../CreatePresentation/CreatePresentation';
import { IdentityCredentials } from '../IdentityCredentials/IdentityCredentials';
import { DidUpgradeFlow } from '../DidUpgradeFlow/DidUpgradeFlow';
import { SignQuote } from '../SignQuote/SignQuote';
import { SignDidFlow } from '../SignDidFlow/SignDidFlow';
import { SignDidExtrinsic } from '../SignDidExtrinsic/SignDidExtrinsic';
import { DidManageRouter } from '../DidManageRouter/DidManageRouter';
import { paths } from '../paths';
import { W3NCreateFlow } from '../W3NCreateFlow/W3NCreateFlow';
import { W3NManageRouter } from '../W3NManageRouter/W3NManageRouter';
import { CreateDidDApp } from '../CreateDidDApp/CreateDidDApp';

interface Props {
  identities: IdentitiesMap;
}

function useRedirectToCurrent() {
  const { address } = useParams() as { address: string };
  const noAddressProvided = address === ':address';

  const history = useHistory();
  const current = useCurrentIdentity();

  const location = useLocation();
  const pathname = location.pathname.replace(address, current || '');
  const url = `${pathname}${location.search}`;

  useEffect(() => {
    if (noAddressProvided && current) {
      history.replace(url);
    }
  }, [noAddressProvided, current, address, history, url]);

  return noAddressProvided;
}

export function SpecificIdentityRouter({
  identities,
}: Props): JSX.Element | null {
  const { address } = useParams() as { address: string };

  useEffect(() => {
    if (address in identities) {
      setCurrentIdentity(address);
    }
  }, [address, identities]);

  const redirectIsPending = useRedirectToCurrent();
  if (redirectIsPending) {
    return null; // redirect pending
  }

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

        <Route path={paths.identity.credentials.presentation}>
          <CreatePresentation identity={identity} />
        </Route>

        <Route path={paths.identity.credentials.base}>
          <IdentityCredentials identity={identity} />
        </Route>

        <Route path={paths.identity.remove}>
          <RemoveIdentity identity={identity} />
        </Route>

        <Route path={paths.identity.reset.start}>
          <ResetIdentity identity={identity} />
        </Route>

        <Route path={paths.popup.claim}>
          <SignQuote identity={identity} />
        </Route>

        <Route path={paths.popup.signDid.start}>
          <SignDidFlow identity={identity} />
        </Route>

        <Route path={paths.popup.signDidExtrinsic}>
          <SignDidExtrinsic identity={identity} />
        </Route>

        <Route path={paths.popup.createDid}>
          <CreateDidDApp identity={identity} />
        </Route>

        <Route path={paths.identity.did.upgrade.start}>
          <DidUpgradeFlow identity={identity} />
        </Route>

        <Route path={paths.identity.did.manage.start}>
          <DidManageRouter identity={identity} />
        </Route>

        <Route path={paths.identity.web3name.create.base}>
          <W3NCreateFlow identity={identity} />
        </Route>

        <Route path={paths.identity.web3name.manage.start}>
          <W3NManageRouter identity={identity} />
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
