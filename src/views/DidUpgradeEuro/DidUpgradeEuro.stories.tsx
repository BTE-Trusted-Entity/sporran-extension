import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidUpgradeEuro } from './DidUpgradeEuro';

export default {
  title: 'Views/DidUpgradeEuro',
  component: DidUpgradeEuro,
} as Meta;

export function Template() {
  return (
    <DidUpgradeEuro
      identity={identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']}
    />
  );
}
