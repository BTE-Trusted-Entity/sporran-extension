import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { UnlockVestedFunds } from './UnlockVestedFunds';

describe('UnlockVestedFunds', () => {
  it('should render', async () => {
    const { container } = render(
      <UnlockVestedFunds
        identity={
          identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
