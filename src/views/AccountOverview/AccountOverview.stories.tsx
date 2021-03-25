import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import {
  BalanceChangeResponse,
  MessageType,
} from '../../connection/MessageType';
import { NEW } from '../../utilities/accounts/accounts';
import { paths } from '../paths';

import { AccountOverview } from './AccountOverview';

export default {
  title: 'Views/AccountOverview',
  component: AccountOverview,
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

function mockListener(
  callback: Parameters<typeof browser.runtime.onMessage.addListener>[0],
) {
  const response = {
    type: MessageType.balanceChangeResponse,
    data: { balance: '04625103a72000' },
  } as BalanceChangeResponse;
  callback(response, {});
}

export function Template(): JSX.Element {
  browser.runtime.onMessage.addListener = mockListener;

  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/send',
      ]}
    >
      <Route path={paths.account.overview}>
        <AccountOverview
          account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
          accounts={accounts}
        />
      </Route>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  browser.runtime.onMessage.addListener = mockListener;

  return (
    <MemoryRouter initialEntries={['/account/NEW/send']}>
      <Route path={paths.account.overview}>
        <AccountOverview account={NEW} accounts={accounts} />
      </Route>
    </MemoryRouter>
  );
}
