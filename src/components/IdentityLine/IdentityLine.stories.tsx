import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { IdentityLine } from './IdentityLine';

export default {
  title: 'Components/IdentityLine',
  component: IdentityLine,
} as Meta;

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return <IdentityLine identity={identity} />;
}
