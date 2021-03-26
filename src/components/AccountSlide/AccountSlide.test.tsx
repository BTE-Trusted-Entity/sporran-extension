import userEvent from '@testing-library/user-event';
import { browser } from 'webextension-polyfill-ts';

import { render, screen } from '../../testing';
import { saveAccount } from '../../utilities/accounts/accounts';
import {
  BalanceChangeResponse,
  MessageType,
} from '../../connection/MessageType';

import { AccountSlide } from './AccountSlide';
import { AccountSlideNew } from './AccountSlideNew';

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

describe('AccountSlide', () => {
  it('should render', async () => {
    const { container } = render(<AccountSlide account={account} />);
    expect(container).toMatchSnapshot();
  });

  it('should enable editing the account name', async () => {
    render(<AccountSlide account={account} />);

    userEvent.click(await screen.findByLabelText('Account options'));
    userEvent.click(
      await screen.findByRole('menuitem', { name: 'Edit account name' }),
    );
    userEvent.type(await screen.findByLabelText('Account name:'), 'Foo');
    userEvent.click(await screen.findByRole('button', { name: 'Save' }));

    expect(saveAccount).toHaveBeenCalledWith({
      name: 'Foo',
      address: account.address,
      index: 1,
    });
  });
});

describe('AccountSlideNew', () => {
  it('should render', async () => {
    const { container } = render(<AccountSlideNew />);
    expect(container).toMatchSnapshot();
  });
});
