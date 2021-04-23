import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { browser } from 'webextension-polyfill-ts';

import { mockBackgroundScript } from '../../testing/mockBackgroundScript';
import { accountsMock as accounts } from '../../testing/AccountsProviderMock';
import { paths } from '../paths';

import { SendToken } from './SendToken';

export default {
  title: 'Views/SendToken',
  component: SendToken,
} as Meta;

export function Template(): JSX.Element {
  mockBackgroundScript(browser);

  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/send',
      ]}
    >
      <Route path={paths.account.send.start}>
        <SendToken
          account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
        />
      </Route>
    </MemoryRouter>
  );
}
