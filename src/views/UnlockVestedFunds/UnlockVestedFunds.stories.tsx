import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { UnlockVestedFunds } from './UnlockVestedFunds';

export default {
  title: 'Views/UnlockVestedFunds',
  component: UnlockVestedFunds,
} as Meta;

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return <UnlockVestedFunds identity={identity} />;
}
