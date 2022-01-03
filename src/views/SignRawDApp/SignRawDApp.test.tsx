import { render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { SignRawOriginInput } from '../../dApps/SignRawChannels/types';
import { paths } from '../paths';

import { SignRawDApp } from './SignRawDApp';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));

const mockData: SignRawOriginInput = {
  origin:
    'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  id: 1,
  data: '0xCAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFE',
  type: 'bytes',
  dAppName: 'FOO',
};

describe('SignRawDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.sign} data={mockData}>
        <SignRawDApp />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
