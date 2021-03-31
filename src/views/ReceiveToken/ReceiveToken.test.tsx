import { MemoryRouter, Route } from 'react-router-dom';

import {
  accountsMock as accounts,
  mockBackgroundScript,
  render,
} from '../../testing';
import { NEW } from '../../utilities/accounts/accounts';
import { paths } from '../paths';

import { ReceiveToken } from './ReceiveToken';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('ReceiveToken', () => {
  it('should render a normal account', async () => {
    mockBackgroundScript();
    document.queryCommandSupported = () => true;
    document.execCommand = () => true;

    const { container } = render(
      <MemoryRouter initialEntries={[`/account/${account.address}/receive`]}>
        <Route path={paths.account.receive}>
          <ReceiveToken account={account} />,
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new account', async () => {
    mockBackgroundScript();

    const { container } = render(
      <MemoryRouter initialEntries={['/account/NEW/receive']}>
        <Route path={paths.account.receive}>
          <ReceiveToken account={NEW} />,
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
