import { useEffect } from 'react';
import {
  Redirect,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  IdentitiesMap,
  NEW,
  setCurrentIdentity,
  useCurrentIdentity,
  useIdentities,
} from '../../utilities/identities/identities';
import { useConfiguration } from '../../configuration/useConfiguration';
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
import { DidUpgradeFlow } from '../DidUpgradeFlow/DidUpgradeFlow';
import { DidDowngradeFlow } from '../DidDowngradeFlow/DidDowngradeFlow';
import { SignQuote } from '../SignQuote/SignQuote';
import { SignDid } from '../SignDid/SignDid';
import { DidManage } from '../DidManage/DidManage';
import { DidEndpointsFlow } from '../DidEndpointsFlow/DidEndpointsFlow';
import { paths } from '../paths';

interface Props {
  identities: IdentitiesMap;
}

function useRedirectToCurrent() {
  const { address } = useParams() as { address: string };
  const noAddressProvided = address === ':address';

  const navigate = useNavigate();
  const { data: current } = useCurrentIdentity();

  const location = useLocation();
  const pathname = location.pathname.replace(address, current || '');
  const url = `${pathname}${location.search}`;

  useEffect(() => {
    if (noAddressProvided && current) {
      navigate(url, { replace: true });
    }
  }, [noAddressProvided, current, address, navigate, url]);

  return noAddressProvided;
}

export function SpecificIdentityRouter({
  identities,
}: Props): JSX.Element | null {
  const { features } = useConfiguration();
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
      <Routes>
        <Route
          path={paths.identity.receive}
          element={<ReceiveToken identity={identity} />}
        />

        <Route
          path={paths.identity.send.start}
          element={<SendTokenFlow identity={identity} />}
        />

        <Route
          path={paths.identity.credentials}
          element={<IdentityCredentials identity={identity} />}
        />

        <Route
          path={paths.identity.remove}
          element={<RemoveIdentity identity={identity} />}
        />

        <Route
          path={paths.identity.reset.start}
          element={<ResetIdentity identity={identity} />}
        />

        <Route
          path={paths.identity.vest}
          element={<UnlockVestedFunds identity={identity} />}
        />

        <Route
          path={paths.popup.claim}
          element={<SignQuote identity={identity} />}
        />

        {features.fullDid && (
          <Route
            path={paths.popup.signDid}
            element={<SignDid identity={identity} />}
          />
        )}

        {features.fullDid && (
          <Route
            path={paths.identity.did.upgrade.start}
            element={<DidUpgradeFlow identity={identity} />}
          />
        )}

        {features.fullDid && (
          <Route
            path={paths.identity.did.downgrade.start}
            element={<DidDowngradeFlow identity={identity} />}
          />
        )}

        {features.fullDid && (
          <Route
            path={paths.identity.did.endpoints.start}
            element={<DidEndpointsFlow identity={identity} />}
          />
        )}

        {features.fullDid && (
          <Route
            path={paths.identity.did.manage}
            element={<DidManage identity={identity} />}
          />
        )}

        <Route
          path={paths.identity.overview}
          element={<IdentityOverview identity={identity} />}
        />
      </Routes>
    </>
  );
}

export function IdentitiesRouter(): JSX.Element {
  const identities = useIdentities();

  return (
    <Routes>
      <Route path={paths.identity.add} element={<Welcome again />} />

      <Route path={paths.identity.create.start} element={<CreateIdentity />} />

      <Route path={paths.identity.import.start} element={<ImportIdentity />} />

      <Route
        path={paths.identity.overview}
        element={
          identities.data && (
            <SpecificIdentityRouter identities={identities.data} />
          )
        }
      />
    </Routes>
  );
}
