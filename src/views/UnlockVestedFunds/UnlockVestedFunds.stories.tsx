import { Meta } from '@storybook/react';

import { UnlockVestedFunds } from './UnlockVestedFunds';
import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

export default {
  title: 'Views/UnlockVestedFunds',
  component: UnlockVestedFunds,
} as Meta;

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return <UnlockVestedFunds account={account} />;
}
