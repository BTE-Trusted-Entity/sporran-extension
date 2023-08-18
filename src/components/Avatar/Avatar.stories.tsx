import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { Avatar } from './Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  decorators: [(story) => <div style={{ textAlign: 'center' }}>{story()}</div>],
} as Meta;

export function Template() {
  return (
    <Avatar
      identity={
        identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
      }
    />
  );
}

export function withFullDid() {
  return (
    <Avatar
      identity={
        identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
      }
    />
  );
}
