import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { accountsMock as accounts } from '../../testing';
import { NEW } from '../../utilities/accounts/accounts';
import { paths } from '../paths';

import { ReceiveToken } from './ReceiveToken';

export default {
  title: 'Views/ReceiveToken',
  component: ReceiveToken,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/receive',
      ]}
    >
      <Route path={paths.account.receive}>
        <ReceiveToken
          account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
        />
      </Route>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/account/NEW/receive']}>
      <Route path={paths.account.receive}>
        <ReceiveToken account={NEW} />{' '}
      </Route>
    </MemoryRouter>
  );
}
