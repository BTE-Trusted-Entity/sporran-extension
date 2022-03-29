import { identitiesMock as identities, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import { paths } from '../paths';

import { SignDidExtrinsic } from './SignDidExtrinsic';
import { useExtrinsicValues } from './useExtrinsicValues';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));

const input: SignDidExtrinsicOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  extrinsic: '0x1c0426000c666f6f',
  signer: '4tMMYZHsFfqzfCsgCPLJSBmomBv2d6cBEYzHKMGVKz2VjACR',
};

jest.mock('./useExtrinsicValues');
jest.mocked(useExtrinsicValues).mockReturnValue([
  {
    label: 'from',
    value:
      'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  },
  {
    label: 'method data',
    value:
      'namespace.method(input = "some meaningful values you would definitely like to see")',
  },
]);

describe('SignDidExtrinsic', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input}>
        <SignDidExtrinsic
          identity={
            identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
  it('should allow signing with full did', async () => {
    mockIsFullDid(true);

    const { container } = render(
      <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input}>
        <SignDidExtrinsic
          identity={
            identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
