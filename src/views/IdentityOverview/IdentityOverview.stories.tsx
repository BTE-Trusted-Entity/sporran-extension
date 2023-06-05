import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
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

const uri = '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';
const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

const fullDidUri = '/identity/4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo';
const fullDidIdentity =
  identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const web3NameIdentity =
  identities['4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q'];

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

export function ImportSuccess(): JSX.Element {
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

export function ResetSuccess(): JSX.Element {
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

export function withFullDid(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[fullDidUri]}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={fullDidIdentity} />
      </Route>
    </MemoryRouter>
  );
}

export function withWeb3Name(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[fullDidUri]}>
      <Route path={paths.identity.overview}>
        <IdentityOverview identity={web3NameIdentity} />
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

export function onChainDidRemoved(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB',
      ]}
    >
      <Route path={paths.identity.overview}>
        <IdentityOverview
          identity={
            identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
