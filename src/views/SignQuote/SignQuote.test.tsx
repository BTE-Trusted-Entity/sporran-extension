import { render } from '../../testing/testing';
import { mockTerms } from '../../utilities/cTypes/cTypes.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

describe('SignQuote', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.claim} data={mockTerms}>
        <SignQuote />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
