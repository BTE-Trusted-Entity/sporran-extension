import { identitiesMock as identities, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';

import { mockIsFullDid } from '../../utilities/did/did.mock';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { SharedCredential } from '../../utilities/credentials/credentials';

import { SignDid } from './SignDid';

const mockPopupData: SignDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  plaintext: 'All your base are belong to us',
};

mockIsFullDid(true);

const mockSharedCredentials: SharedCredential[] = [
  {
    sporranCredential: credentialsMock[0],
    sharedContents: ['Email'],
  },
  {
    sporranCredential: credentialsMock[3],
    sharedContents: [],
  },
];

describe('SignDid', () => {
  it('should render without credentials', async () => {
    const { container } = render(
      <SignDid
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        onCancel={jest.fn()}
        popupData={mockPopupData}
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
  it('should render with credentials', async () => {
    const { container } = render(
      <SignDid
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        popupData={mockPopupData}
        onCancel={jest.fn()}
        credentials={mockSharedCredentials}
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
