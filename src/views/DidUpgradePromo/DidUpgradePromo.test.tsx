import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { DidUpgradePromo } from './DidUpgradePromo';

jest.mock('../../utilities/didUpgradePromo/didUpgradePromo');

describe('DidUpgradePromo', () => {
  it('should render', async () => {
    const { container } = render(
      <DidUpgradePromo
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
