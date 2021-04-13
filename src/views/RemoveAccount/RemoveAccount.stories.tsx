import { Meta, Story } from '@storybook/react';

import { RemoveAccount } from './RemoveAccount';

type Type = Story<Parameters<typeof RemoveAccount>[0]>;

export default {
  title: 'Views/RemoveAccount',
  component: RemoveAccount,
} as Meta;

const account = {
  name: 'My Sporran Account',
  tartan: 'MacFarlane',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  index: 1,
};

export { RemoveAccount };
(RemoveAccount as Type).args = {
  account,
};
