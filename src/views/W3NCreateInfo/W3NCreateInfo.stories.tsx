import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreateInfo } from './W3NCreateInfo';

export default {
  title: 'Views/W3NCreateInfo',
  component: W3NCreateInfo,
} as Meta;

const on = identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];
const off = identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function OnChainDid(): JSX.Element {
  return <W3NCreateInfo identity={on} />;
}

export function OffChainDid(): JSX.Element {
  return <W3NCreateInfo identity={off} />;
}
