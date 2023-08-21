import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreateInfo } from './W3NCreateInfo';

export default {
  title: 'Views/W3NCreateInfo',
  component: W3NCreateInfo,
} as Meta;

const on = identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];
const off = identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

export function OnChainDid() {
  return <W3NCreateInfo identity={on} />;
}

export function OffChainDid() {
  return <W3NCreateInfo identity={off} />;
}
