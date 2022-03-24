import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreatePromo } from './W3NCreatePromo';

export default {
  title: 'Views/W3NCreatePromo',
  component: W3NCreatePromo,
} as Meta;

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

export function Template(): JSX.Element {
  return <W3NCreatePromo identity={identity} web3name="fancy-name" />;
}
