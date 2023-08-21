import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';

import {
  credentialsMock,
  CredentialsProviderMock,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { IdentityCredentials } from './IdentityCredentials';

const identity =
  identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

export default {
  title: 'Views/IdentityCredentials',
  component: IdentityCredentials,
} as Meta;

export function ManyCredentials() {
  return <IdentityCredentials identity={identity} />;
}

export function New() {
  return <IdentityCredentials identity={NEW} />;
}

export function NoCredentials() {
  return (
    <CredentialsProviderMock credentials={[]}>
      <IdentityCredentials identity={identity} />
    </CredentialsProviderMock>
  );
}

export function FewCredentials() {
  return (
    <CredentialsProviderMock credentials={credentialsMock.slice(0, 4)}>
      <IdentityCredentials identity={identity} />
    </CredentialsProviderMock>
  );
}
