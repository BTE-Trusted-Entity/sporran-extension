import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { RemoveIdentity } from './RemoveIdentity';

export default {
  title: 'Views/RemoveIdentity',
  component: RemoveIdentity,
} as Meta;

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return <RemoveIdentity identity={identity} />;
}
