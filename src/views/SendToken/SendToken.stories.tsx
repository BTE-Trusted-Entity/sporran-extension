import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { accountsMock as accounts } from '../../testing/AccountsProviderMock';
import { paths } from '../paths';

import { SendToken } from './SendToken';

export default {
  title: 'views/SendToken',
  component: SendToken,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/receive',
      ]}
    >
      <Route path={paths.account.receive}>
        <SendToken
          account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
        />
      </Route>
    </MemoryRouter>
  );
}
