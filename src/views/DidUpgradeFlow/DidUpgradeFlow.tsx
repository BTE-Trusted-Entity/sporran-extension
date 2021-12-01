import { Route, Routes, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { DidUpgradeExplainer } from '../DidUpgradeExplainer/DidUpgradeExplainer';
import { DidUpgrade } from '../DidUpgrade/DidUpgrade';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidUpgradeFlow({ identity }: Props): JSX.Element {
  return (
    <Routes>
      <Route
        path={paths.identity.did.upgrade.sign}
        element={<DidUpgrade identity={identity} />}
      />
      <Route
        path={paths.identity.did.upgrade.start}
        element={<DidUpgradeExplainer identity={identity} />}
      />
    </Routes>
  );
}
