import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import {
  credentialsMock,
  CredentialsProviderMock,
  notDownloaded,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { IdentityOverview } from './IdentityOverview';

export default {
  title: 'Views/IdentityOverview',
  component: IdentityOverview,
} as Meta;

const uri = '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';
const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

const warningIdentity =
  identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template() {
  return (
    <MemoryRouter initialEntries={[uri]}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}

export function New() {
  return (
    <MemoryRouter initialEntries={['/identity/NEW/send']}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={NEW} />
      </Route>
    </MemoryRouter>
  );
}

export function CreateSuccess() {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1/created',
        uri,
      ]}
    >
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}

export function ImportSuccess() {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1/imported',
        uri,
      ]}
    >
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}

export function ResetSuccess() {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1/pwreset',
        uri,
      ]}
    >
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={identity} />
      </Route>
    </MemoryRouter>
  );
}

export function BackupWarning() {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
      ]}
    >
      <Route path={paths.identity.overview}>
        <CredentialsProviderMock credentials={notDownloaded}>
          <IdentityOverview identity={warningIdentity} />
        </CredentialsProviderMock>
      </Route>
    </MemoryRouter>
  );
}

export function FewCredentials() {
  return (
    <CredentialsProviderMock credentials={credentialsMock.slice(0, 4)}>
      <IdentityOverview identity={identity} />
    </CredentialsProviderMock>
  );
}
