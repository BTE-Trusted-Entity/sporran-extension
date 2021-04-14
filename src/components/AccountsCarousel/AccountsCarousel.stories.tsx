import { Meta } from '@storybook/react';

import { accountsMock } from '../../testing/AccountsProviderMock';
import { mockBackgroundScript } from '../../testing/mockBackgroundScript';
import { paths } from '../../views/paths';
import { AccountsCarousel } from './AccountsCarousel';

export default {
  title: 'Components/AccountsCarousel',
  component: AccountsCarousel,
} as Meta;

export function Template(): JSX.Element {
  mockBackgroundScript();

  return (
    <AccountsCarousel
      path={paths.account.overview}
      account={accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
    />
  );
}
