import { Meta, Story } from '@storybook/react';

import { accountsMock } from '../../testing/AccountsProviderMock';

import { AccountCredentials } from './AccountCredentials';

type Type = Story<Parameters<typeof AccountCredentials>[0]>;

const account =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export default {
  title: 'Views/AccountCredentials',
  component: AccountCredentials,
} as Meta;

export { AccountCredentials };
(AccountCredentials as Type).args = {
  account,
};
