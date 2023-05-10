import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { DidUpgrade } from './DidUpgrade';

export default {
  title: 'Views/DidUpgrade',
  component: DidUpgrade,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1/did/upgrade/kilt',
      ]}
    >
      <Route path={paths.identity.did.upgrade.kilt}>
        <DidUpgrade
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
