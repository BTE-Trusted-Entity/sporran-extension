import { Meta } from '@storybook/react';
import { browser } from 'webextension-polyfill-ts';

import { RemoveAccount } from './RemoveAccount';
import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';
import { mockBackgroundScript } from '../../testing/mockBackgroundScript';

export default {
  title: 'Views/RemoveAccount',
  component: RemoveAccount,
} as Meta;

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  mockBackgroundScript(browser);
  return <RemoveAccount account={account} />;
}
