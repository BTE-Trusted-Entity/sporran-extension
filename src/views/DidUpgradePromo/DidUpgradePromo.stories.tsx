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
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/did/upgrade/promo/4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
      ]}
    >
      <Route path={paths.identity.did.upgrade.promo}>
        <DidUpgradePromo
          identity={
            identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
