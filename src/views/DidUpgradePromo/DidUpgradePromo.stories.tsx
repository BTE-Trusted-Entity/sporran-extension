import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { DidUpgradePromo } from './DidUpgradePromo';

export default {
  title: 'Views/DidUpgradePromo',
  component: DidUpgradePromo,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1/did/upgrade/promo',
      ]}
    >
      <Route path={paths.identity.did.upgrade.promo}>
        <DidUpgradePromo
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
