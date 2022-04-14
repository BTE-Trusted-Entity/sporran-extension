import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreateSign } from './W3NCreateSign';

export default {
  title: 'Views/W3NCreateSign',
  component: W3NCreateSign,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template(): JSX.Element {
  return <W3NCreateSign identity={identity} web3name="fancy-name" />;
}
