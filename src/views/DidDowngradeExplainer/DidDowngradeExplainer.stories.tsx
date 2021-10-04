import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { DidDowngradeExplainer } from './DidDowngradeExplainer';

export default {
  title: 'Views/DidDowngradeExplainer',
  component: DidDowngradeExplainer,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/did/downgrade',
      ]}
    >
      <Route path={paths.identity.did.downgrade.start}>
        <DidDowngradeExplainer
          identity={
            identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
