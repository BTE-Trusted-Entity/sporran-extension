import { MemoryRouter, Route } from 'react-router-dom';

import { render } from '../../testing';
import { NEW } from '../../utilities/accounts/accounts';
import { paths } from '../paths';

import { AccountOverview } from './AccountOverview';

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

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('AccountOverview', () => {
  it('should render a normal account', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/account/${account.address}/`]}>
        <Route path={paths.account.overview}>
          <AccountOverview account={account} accounts={accounts} />,
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new account', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/account/NEW/']}>
        <Route path={paths.account.overview}>
          <AccountOverview account={NEW} accounts={accounts} />,
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
