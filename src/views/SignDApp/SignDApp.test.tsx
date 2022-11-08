import { render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { useExtrinsicValues } from './useExtrinsicValues';
import { SignDApp } from './SignDApp';

jest.mock('@kiltprotocol/utils', () => ({
  Crypto: { encodeAddress: (address: string) => address },
}));

jest.mock('./useExtrinsicValues');
jest.mocked(useExtrinsicValues).mockReturnValue([
  {
    label: 'from',
    value:
      'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  },
  { label: 'version', value: '1' },
  { label: 'nonce', value: '1' },
  {
    label: 'method data',
    value:
      'namespace.method(input = "some meaningful values you would definitely like to see")',
  },
  { label: 'lifetime', value: 'mortal, valid from 1 to 1,000,000' },
]);

const mockExtrinsic = {
  address: '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
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
