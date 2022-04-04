import { Meta } from '@storybook/react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

export default {
  title: 'Views/DidUpgradeExplainer',
  component: DidUpgradeExplainer,
} as Meta;

export function NotOnChain(): JSX.Element {
  return (
    <DidUpgradeExplainer
      identity={identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
    />
  );
}

export function DeletedFromChain(): JSX.Element {
  return (
    <DidUpgradeExplainer
      identity={identities['4oESHtb7Hu6grwwQVpqTj8G1XdvEsbDUmWNnT8CdbhVGQx7Z']}
    />
  );
}
