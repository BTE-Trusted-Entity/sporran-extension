import { identitiesMock as identities, render } from '../../testing/testing';

import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { DidUpgradeEuro } from './DidUpgradeEuro';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue({ did: 'EUR 4,00' });

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
