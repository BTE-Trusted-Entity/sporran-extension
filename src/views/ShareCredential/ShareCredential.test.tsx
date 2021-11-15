import { render } from '../../testing/testing';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { ShareInput } from '../../channels/shareChannel/types';
import { paths } from '../paths';

import { ShareCredential } from './ShareCredential';

const mockCTypesRequest: ShareInput = {
  credentialRequest: {
    cTypes: [
      {
        cTypeHash: credentialsMock[0].request.claim.cTypeHash,
      },
    ],
    challenge: 'PASS',
  },
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
