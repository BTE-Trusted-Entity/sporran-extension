import { Meta } from '@storybook/react';

import {
  accountsMock,
  moreAccountsMock,
  AccountsProviderMock,
} from '../../utilities/accounts/AccountsProvider.mock';
import { paths } from '../../views/paths';
import { AccountsCarousel } from './AccountsCarousel';

export default {
  title: 'Components/AccountsCarousel',
  component: AccountsCarousel,
  decorators: [(story) => <div style={{ textAlign: 'center' }}>{story()}</div>],
} as Meta;

export function Template(): JSX.Element {
  return (
    <AccountsCarousel
      path={paths.account.overview}
      account={accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
    />
  );
}

export function NoBubbles(): JSX.Element {
  return (
    <AccountsProviderMock accounts={moreAccountsMock}>
      <AccountsCarousel
        path={paths.account.overview}
        account={
          moreAccountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />
    </AccountsProviderMock>
  );
}
