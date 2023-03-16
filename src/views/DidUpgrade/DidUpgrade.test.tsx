import { identitiesMock as identities, render } from '../../testing/testing';

import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { DidUpgrade } from './DidUpgrade';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue({ did: 'EUR 4,00' });

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
