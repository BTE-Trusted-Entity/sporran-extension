import { Meta, Story } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { IdentityCredentials } from './IdentityCredentials';

type Type = Story<Parameters<typeof IdentityCredentials>[0]>;

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export default {
  title: 'Views/IdentityCredentials',
  component: IdentityCredentials,
} as Meta;

export { IdentityCredentials };
(IdentityCredentials as Type).args = {
  identity,
};
