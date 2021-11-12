import { render } from '../../testing/testing';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { paths } from '../paths';

import { ShareCredential } from './ShareCredential';

const mockCTypesRequest = {
  acceptedCTypes: [
    {
      cTypeHash: credentialsMock[0].request.claim.cTypeHash,
    },
  ],
  verifierDid: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
};

describe('ShareCredential', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.share} data={mockCTypesRequest}>
        <ShareCredential />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
