import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

export default {
  title: 'Views/DidUpgradeExplainer',
  component: DidUpgradeExplainer,
} as Meta;

export function Template(): JSX.Element {
  return (
    <DidUpgradeExplainer
      identity={identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
    />
  );
}
