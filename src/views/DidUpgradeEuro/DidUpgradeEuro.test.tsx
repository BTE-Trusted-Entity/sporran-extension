import { identitiesMock as identities, render } from '../../testing/testing';

import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { DidUpgradeEuro } from './DidUpgradeEuro';

describe('DidUpgradeEuro', () => {
  it('should render', async () => {
    const { container } = render(
      <DidUpgradeEuro
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
