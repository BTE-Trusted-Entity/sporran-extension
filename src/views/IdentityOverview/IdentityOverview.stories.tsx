import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentityOverview } from './IdentityOverview';

export default {
  title: 'Views/IdentityOverview',
  component: IdentityOverview,
} as Meta;

const uri = '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[uri]}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/identity/NEW/send']}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={NEW} />
      </Route>
    </MemoryRouter>
  );
}

export function CreateSuccess(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/created',
        uri,
      ]}
    >
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}

export function ImportSuccess(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/imported',
        uri,
      ]}
    >
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}

export function ResetSuccess(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/reset',
        uri,
      ]}
    >
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}
