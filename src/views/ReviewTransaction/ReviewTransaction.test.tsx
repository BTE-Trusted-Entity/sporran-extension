import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock as identities, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { ReviewTransaction } from './ReviewTransaction';

describe('ReviewTransaction', () => {
  it('should render', async () => {
    const { container } = render(
      <ReviewTransaction
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
        recipient="4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos"
        amount={BalanceUtils.toFemtoKilt(120)}
        fee={BalanceUtils.toFemtoKilt(0.00000001)}
        tip={BalanceUtils.toFemtoKilt(0.01)}
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
