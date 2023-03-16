import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidUpgrade } from './DidUpgrade';

export default {
  title: 'Views/DidUpgrade',
  component: DidUpgrade,
} as Meta;

export function Template() {
  return (
    <DidUpgrade
      identity={identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']}
    />
  );
}
