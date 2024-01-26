import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { identitiesMock as identities, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { ReviewTransaction } from './ReviewTransaction';

describe('ReviewTransaction', () => {
  it('should render', async () => {
    const { container } = render(
      <ReviewTransaction
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
        recipient="4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo"
        amount={BalanceUtils.toFemtoKilt(120)}
        fee={BalanceUtils.toFemtoKilt(0.00000001)}
        tip={BalanceUtils.toFemtoKilt(0.01)}
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
