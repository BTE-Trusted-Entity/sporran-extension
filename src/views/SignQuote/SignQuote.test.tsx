import { identitiesMock as identities, render } from '../../testing/testing';
import { mockTerms } from '../../utilities/mockTerms/mockTerms';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

describe('SignQuote', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.claim} data={mockTerms}>
        <SignQuote
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
