import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock as identities, render } from '../../testing/testing';

import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { getFee } from '../../utilities/didUpgrade/didUpgrade';

import { getDepositDid } from '../../utilities/getDeposit/getDeposit';

import { DidUpgrade } from './DidUpgrade';

jest.mock('../../utilities/didUpgrade/didUpgrade', () => ({
  getFee: jest.fn(),
}));
jest.mock('../../utilities/getDeposit/getDeposit');
jest.mocked(getFee).mockResolvedValue(BalanceUtils.toFemtoKilt(0.01));
jest.mocked(getDepositDid).mockResolvedValue({
  amount: BalanceUtils.toFemtoKilt(1),
  owner: '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
});

describe('DidUpgrade', () => {
  it('should render', async () => {
    const { container } = render(
      <DidUpgrade
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
