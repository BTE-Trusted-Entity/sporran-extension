import { act, render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { getPromoStatus } from '../../utilities/didUpgradePromo/didUpgradePromo';

import { DidUpgradePromo } from './DidUpgradePromo';

jest.mock('../../utilities/didUpgradePromo/didUpgradePromo');

jest.mocked(getPromoStatus).mockResolvedValue({
  account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
  remaining_dids: 1000,
  is_active: true,
});

describe('DidUpgradePromo', () => {
  it('should render', async () => {
    const { container } = render(
      <DidUpgradePromo
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    await act(async () => {
      await getPromoStatus();
    });
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
