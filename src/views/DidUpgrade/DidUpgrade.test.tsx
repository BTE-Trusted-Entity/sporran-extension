import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { identitiesMock as identities, render } from '../../testing/testing';

import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { useKiltCosts } from '../../utilities/didUpgrade/didUpgrade';

import { DidUpgrade } from './DidUpgrade';

jest.mock('../../utilities/didUpgrade/didUpgrade', () => ({
  useKiltCosts: jest.fn(),
}));

jest.mocked(useKiltCosts).mockReturnValue({
  fee: BalanceUtils.toFemtoKilt(0.01),
  deposit: BalanceUtils.toFemtoKilt(1),
  total: BalanceUtils.toFemtoKilt(1.01),
  insufficientKilt: false,
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
