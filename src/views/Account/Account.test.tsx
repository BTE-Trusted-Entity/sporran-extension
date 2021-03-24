import userEvent from '@testing-library/user-event';
import { browser } from 'webextension-polyfill-ts';

import { render, screen } from '../../testing';
import {
  saveAccount,
  setCurrentAccount,
} from '../../utilities/accounts/accounts';
import {
  BalanceChangeResponse,
  MessageType,
} from '../../connection/MessageType';

import { Account } from './Account';

jest.mock('../../utilities/accounts/accounts');
jest.spyOn(browser.runtime, 'sendMessage');
jest
  .spyOn(browser.runtime.onMessage, 'addListener')
  .mockImplementation(async (callback) => {
    const response = {
      type: MessageType.balanceChangeResponse,
      data: { balance: '04625103a72000' },
    } as BalanceChangeResponse;
    callback(response, {});
  });

const account = {
  name: 'My Sporran Account',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  index: 1,
};

describe('Account', () => {
  it('should render', async () => {
    const { container } = render(<Account account={account} />);
    expect(container).toMatchSnapshot();
  });

  it('should update the current account', async () => {
    render(<Account account={account} />);
    expect(setCurrentAccount).toHaveBeenCalledWith(account.address);
  });

  it('should enable editing the account name', async () => {
    render(<Account account={account} />);

    userEvent.click(await screen.findByRole('button', { name: 'Rename' }));
    userEvent.type(await screen.findByLabelText('Account name:'), 'Foo');
    userEvent.click(await screen.findByRole('button', { name: 'Save' }));

    expect(
      await screen.findByRole('button', { name: 'Rename' }),
    ).toBeInTheDocument();

    expect(saveAccount).toHaveBeenCalledWith({
      name: 'Foo',
      address: account.address,
      index: 1,
    });
  });
});
