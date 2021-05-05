import { MemoryRouter, Route } from 'react-router-dom';

import {
  accountsMock as accounts,
  mockBackgroundScript,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';
import { waitForNextTartan } from '../../utilities/accounts/getNextTartan.mock';
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
    await waitForDialogUpdate();
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
    await waitForDialogUpdate();
    await waitForNextTartan();
    expect(container).toMatchSnapshot();
  });
});
