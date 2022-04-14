import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { UnlockVestedFunds } from './UnlockVestedFunds';

export default {
  title: 'Views/UnlockVestedFunds',
  component: UnlockVestedFunds,
} as Meta;

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

export function Template(): JSX.Element {
  return <UnlockVestedFunds identity={identity} />;
}
