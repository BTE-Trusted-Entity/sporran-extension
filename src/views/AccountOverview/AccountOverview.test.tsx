import { MemoryRouter, Route } from 'react-router-dom';

import {
  accountsMock,
  mockBackgroundScript,
  render,
} from '../../testing/testing';
import { waitForNextTartan } from '../../utilities/accounts/getNextTartan.mock';
import { NEW } from '../../utilities/accounts/accounts';
import { paths } from '../paths';

import { AccountOverview } from './AccountOverview';

const account =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('AccountOverview', () => {
  it('should render a normal account', async () => {
    mockBackgroundScript();

    const { container } = render(
      <MemoryRouter initialEntries={[`/account/${account.address}/`]}>
        <Route path={paths.account.overview}>
          <AccountOverview account={account} />,
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new account', async () => {
    mockBackgroundScript();

    const { container } = render(
      <MemoryRouter initialEntries={['/account/NEW/']}>
        <Route path={paths.account.overview}>
          <AccountOverview account={NEW} />,
        </Route>
      </MemoryRouter>,
    );
    await waitForNextTartan();
    expect(container).toMatchSnapshot();
  });
});
