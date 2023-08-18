import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { IdentityLine } from './IdentityLine';

export default {
  title: 'Components/IdentityLine',
  component: IdentityLine,
} as Meta;

const identity =
  identitiesMock['4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653'];

export function Template() {
  return <IdentityLine identity={identity} />;
}
