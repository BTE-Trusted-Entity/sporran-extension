import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { IdentitySlide } from './IdentitySlide';
import { IdentitySlideNew } from './IdentitySlideNew';

export default {
  title: 'Components/IdentitySlide',
  component: IdentitySlide,
  decorators: [(story) => <div style={{ textAlign: 'center' }}>{story()}</div>],
} as Meta;

export function Template() {
  return (
    <IdentitySlide
      identity={identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']}
    />
  );
}

export function LongName() {
  return (
    <IdentitySlide
      identity={identities['4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653']}
    />
  );
}

export function New() {
  return <IdentitySlideNew />;
}

export function withFullDid() {
  return (
    <IdentitySlide
      identity={identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']}
    />
  );
}
