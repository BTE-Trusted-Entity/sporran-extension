import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import {
  identitiesMock as identities,
  legacyIdentity,
} from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import {
  CredentialsProviderMock,
  notDownloaded,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { IdentityOverview } from './IdentityOverview';

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

export function withFullDid(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[fullDidUri]}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={fullDidIdentity} />
      </Route>
    </MemoryRouter>
  );
}

export function BackupWarning(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[fullDidUri]}>
      <Route path={paths.identity.overview}>
        <CredentialsProviderMock credentials={notDownloaded}>
          <IdentityOverview identity={fullDidIdentity} />
        </CredentialsProviderMock>
      </Route>
    </MemoryRouter>
  );
}

export function RepairDid(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`/identity/${legacyIdentity.address}`]}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={legacyIdentity} />
      </Route>
    </MemoryRouter>
  );
}
