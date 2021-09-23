import { render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SignDApp } from './SignDApp';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));

const mockExtrinsic = {
  origin:
    'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  specVersion: 1,
  nonce: 1,
  method:
    'namespace.method(input = "some meaningful values you would definitely like to see")',
  lifetimeStart: 1,
  lifetimeEnd: 1000000,
};

describe('SignDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.sign} data={mockExtrinsic}>
        <SignDApp />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
