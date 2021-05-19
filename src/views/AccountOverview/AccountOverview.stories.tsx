import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';
import { NEW } from '../../utilities/accounts/accounts';
import { paths } from '../paths';
import { mockBackgroundScript } from '../../testing/mockBackgroundScript';

import { AccountOverview } from './AccountOverview';

export default {
  title: 'Views/AccountOverview',
  component: AccountOverview,
} as Meta;

const uri = '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  mockBackgroundScript(browser);
  return (
    <MemoryRouter initialEntries={[uri]}>
      <Route path={paths.account.overview}>
        <AccountOverview account={account} />
      </Route>
    </MemoryRouter>
  );
}

export function New(): JSX.Element {
  return (
    <MemoryRouter initialEntries={['/account/NEW/send']}>
      <Route path={paths.account.overview}>
        <AccountOverview account={NEW} />
      </Route>
    </MemoryRouter>
  );
}

export function CreateSuccess(): JSX.Element {
  mockBackgroundScript(browser);
  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/created',
        uri,
      ]}
    >
      <Route path={paths.account.overview}>
        <AccountOverview account={account} />
      </Route>
    </MemoryRouter>
  );
}

export function ImportSuccess(): JSX.Element {
  mockBackgroundScript(browser);
  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/imported',
        uri,
      ]}
    >
      <Route path={paths.account.overview}>
        <AccountOverview account={account} />
      </Route>
    </MemoryRouter>
  );
}

export function ResetSuccess(): JSX.Element {
  mockBackgroundScript(browser);
  return (
    <MemoryRouter
      initialEntries={[
        '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/reset',
        uri,
      ]}
    >
      <Route path={paths.account.overview}>
        <AccountOverview account={account} />
      </Route>
    </MemoryRouter>
  );
}
