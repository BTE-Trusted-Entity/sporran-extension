import { Meta } from '@storybook/react';

import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

import { RemoveAccount } from './RemoveAccount';

export default {
  title: 'Views/RemoveAccount',
  component: RemoveAccount,
} as Meta;

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return <RemoveAccount account={account} />;
}
