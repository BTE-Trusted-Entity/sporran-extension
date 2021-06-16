import { Meta } from '@storybook/react';

import { AccountSlide } from './AccountSlide';
import { AccountSlideNew } from './AccountSlideNew';

import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

export default {
  title: 'Components/AccountSlide',
  component: AccountSlide,
  decorators: [(story) => <div style={{ textAlign: 'center' }}>{story()}</div>],
} as Meta;

export function Template(): JSX.Element {
  return (
    <AccountSlide
      account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
    />
  );
}

export function LongName(): JSX.Element {
  return (
    <AccountSlide
      account={accounts['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
    />
  );
}

export function New(): JSX.Element {
  return <AccountSlideNew />;
}
