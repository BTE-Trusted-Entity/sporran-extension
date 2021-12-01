import { Route, Routes, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';

import { DidDowngradeExplainer } from '../DidDowngradeExplainer/DidDowngradeExplainer';
import { DidDowngrade } from '../DidDowngrade/DidDowngrade';

interface Props {
  identity: Identity;
}

export function DidDowngradeFlow({ identity }: Props): JSX.Element {
  return (
    <Routes>
      <Route
        path={paths.identity.did.downgrade.sign}
        element={<DidDowngrade identity={identity} />}
      />
      <Route
        path={paths.identity.did.downgrade.start}
        element={<DidDowngradeExplainer identity={identity} />}
      />
    </Routes>
  );
}
