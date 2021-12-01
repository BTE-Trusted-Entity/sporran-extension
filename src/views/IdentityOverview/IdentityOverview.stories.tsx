import { Meta } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentityOverview } from './IdentityOverview';
import { Switch } from 'react-router-dom';

export default {
  title: 'Views/IdentityOverview',
  component: IdentityOverview,
} as Meta;

const uri = '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const fullDidUri = '/identity/4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr';
const fullDidIdentity =
  identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[uri]}>
      <Routes>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/identity/NEW/send']}>
      <Routes>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={NEW} />
        </Route>
      </Routes>
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
      <Routes>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </Routes>
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
      <Routes>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </Routes>
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
      <Routes>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export function withFullDid(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[fullDidUri]}>
      <Routes>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={fullDidIdentity} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
