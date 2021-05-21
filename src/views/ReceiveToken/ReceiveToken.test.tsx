import { MemoryRouter, Route } from 'react-router-dom';

import {
  accountsMock as accounts,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';
import { waitForNextTartan } from '../../utilities/accounts/getNextTartan.mock';
import { NEW } from '../../utilities/accounts/accounts';
import '../../components/useCopyButton/useCopyButton.mock';
import { paths } from '../paths';

import { ReceiveToken } from './ReceiveToken';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('ReceiveToken', () => {
  it('should render a normal account', async () => {
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
