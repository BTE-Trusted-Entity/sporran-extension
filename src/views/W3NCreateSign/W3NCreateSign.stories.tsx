import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreateSign } from './W3NCreateSign';

export default {
  title: 'Views/W3NCreateSign',
  component: W3NCreateSign,
} as Meta;

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

export function Template(): JSX.Element {
  return <W3NCreateSign identity={identity} web3name="FancyName" />;
}
