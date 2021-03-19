import userEvent from '@testing-library/user-event';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';

import { render, screen } from '../../testing';
import {
  saveAccount,
  setCurrentAccount,
} from '../../utilities/accounts/accounts';

import { Account } from './Account';

jest.mock('../../utilities/accounts/accounts');
jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
(listenToBalanceChanges as jest.Mock).mockImplementation(
  async (address, callback) => {
    callback(address, new BN(1.234e15));
    return () => {
      // dummy
    };
  },
);

const account = {
  name: 'My Sporran Account',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
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
    });
  });
});
