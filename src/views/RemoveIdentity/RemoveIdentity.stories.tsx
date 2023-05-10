import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { RemoveIdentity } from './RemoveIdentity';

export default {
  title: 'Views/RemoveIdentity',
  component: RemoveIdentity,
} as Meta;

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

export function Template(): JSX.Element {
  return <RemoveIdentity identity={identity} />;
}
