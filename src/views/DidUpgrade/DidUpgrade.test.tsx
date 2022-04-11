import { BalanceUtils } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
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
  owner: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
});

describe('DidUpgrade', () => {
  it('should render', async () => {
    const { container } = render(
      <DidUpgrade
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
