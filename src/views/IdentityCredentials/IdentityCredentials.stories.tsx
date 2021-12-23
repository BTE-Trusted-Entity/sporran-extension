import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { NEW } from '../../utilities/identities/identities';

import {
  credentialsMock,
  CredentialsProviderMock,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { IdentityCredentials } from './IdentityCredentials';

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export default {
  title: 'Views/IdentityCredentials',
  component: IdentityCredentials,
} as Meta;

export function Template(): JSX.Element {
  return <IdentityCredentials identity={identity} />;
}

export function New(): JSX.Element {
  return <IdentityCredentials identity={NEW} />;
}

export function NoCredentials(): JSX.Element {
  return (
    <CredentialsProviderMock credentials={[]}>
      <IdentityCredentials identity={identity} />
    </CredentialsProviderMock>
  );
}

export function FewCredentials(): JSX.Element {
  return (
    <CredentialsProviderMock credentials={credentialsMock.slice(0, 3)}>
      <IdentityCredentials identity={identity} />
    </CredentialsProviderMock>
  );
}
