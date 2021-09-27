import { identitiesMock as identities, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SignDid } from './SignDid';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));

const input = {
  origin: 'https://example.org/foo',
  plaintext: 'All your base are belong to us',
};

describe('SignDid', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.signDid} data={input}>
        <SignDid
          identity={
            identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
