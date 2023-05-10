import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

export default {
  title: 'Views/DidUpgradeExplainer',
  component: DidUpgradeExplainer,
} as Meta;

export function NotOnChain(): JSX.Element {
  return (
    <DidUpgradeExplainer
      identity={identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']}
    />
  );
}

export function DeletedFromChain(): JSX.Element {
  return (
    <DidUpgradeExplainer
      identity={identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']}
    />
  );
}

export function InsufficientKilt(): JSX.Element {
  return (
    <DidUpgradeExplainer
      identity={identities['4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653']}
    />
  );
}
