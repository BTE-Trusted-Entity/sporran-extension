import { BalanceUtils } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { getDeposit, getFee } from '../../utilities/didUpgrade/didUpgrade';

import { DidUpgrade } from './DidUpgrade';

jest.mock('../../utilities/didUpgrade/didUpgrade', () => ({
  getFee: jest.fn(),
  getDeposit: jest.fn(),
}));
jest.mocked(getFee).mockResolvedValue(BalanceUtils.toFemtoKilt(0.01));
jest.mocked(getDeposit).mockResolvedValue(BalanceUtils.toFemtoKilt(1));

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
