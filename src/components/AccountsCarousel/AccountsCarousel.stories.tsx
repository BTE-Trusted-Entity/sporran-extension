import { Meta } from '@storybook/react';

import { mockBackgroundScript } from '../../testing';
import { paths } from '../../views/paths';
import { AccountsCarousel } from './AccountsCarousel';

export default {
  title: 'Components/AccountsCarousel',
  component: AccountsCarousel,
} as Meta;

const accounts = {
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
    name: 'My Sporran Account',
    address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
    index: 1,
  },
  '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
    name: 'My Second Account',
    address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
    index: 2,
  },
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
    name: 'My Third Account',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
    index: 3,
  },
};

export function Template(): JSX.Element {
  mockBackgroundScript();

  return (
    <AccountsCarousel
      path={paths.account.overview}
      account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      accounts={accounts}
    />
  );
}
