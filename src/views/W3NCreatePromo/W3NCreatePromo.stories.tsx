import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreatePromo } from './W3NCreatePromo';

export default {
  title: 'Views/W3NCreatePromo',
  component: W3NCreatePromo,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template(): JSX.Element {
  return <W3NCreatePromo identity={identity} web3name="fancy-name" />;
}
