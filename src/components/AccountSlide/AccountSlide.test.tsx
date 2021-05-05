import userEvent from '@testing-library/user-event';
import { browser } from 'webextension-polyfill-ts';

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '../../testing/testing';
import { waitForNextTartan } from '../../utilities/accounts/getNextTartan.mock';
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
      data: {
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
        balance: '1234000000000000',
      },
    } as BalanceChangeResponse;
    callback(response, {});
  });

const account = {
  name: 'My Sporran Account',
  tartan: 'MacFarlane',
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
    userEvent.type(await screen.findByLabelText('Account name:'), ' Foo');

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    userEvent.click(saveButton);

    expect(saveAccount).toHaveBeenCalledWith({
      name: 'My Sporran Account Foo',
      tartan: account.tartan,
      address: account.address,
      index: 1,
    });

    await waitForElementToBeRemoved(saveButton);
  });
});

describe('AccountSlideNew', () => {
  it('should render', async () => {
    const { container } = render(<AccountSlideNew />);

    await waitForNextTartan();
    expect(container).toMatchSnapshot();
  });
});
