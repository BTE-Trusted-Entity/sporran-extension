import { identitiesMock as identities, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';
import { paths } from '../paths';

import { SignDid } from './SignDid';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));

const input: SignDidOriginInput = {
  dAppName: 'dApp',
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
  it('should allow signing with full did', async () => {
    mockIsFullDid(true);

    const { container } = render(
      <PopupTestProvider path={paths.popup.signDid} data={input}>
        <SignDid
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
