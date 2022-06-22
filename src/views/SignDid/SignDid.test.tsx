import { identitiesMock as identities, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';
import { paths } from '../paths';

import { mockIsFullDid } from '../../utilities/did/did.mock';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { SharedCredential } from '../../utilities/credentials/credentials';

import { SignDid } from './SignDid';

const input: SignDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  plaintext: 'All your base are belong to us',
};

mockIsFullDid(true);

const mockSharedCredentials: SharedCredential[] = [
  {
    credential: credentialsMock[0],
    sharedContents: ['Email'],
  },
  {
    credential: credentialsMock[3],
    sharedContents: [],
  },
];

describe('SignDid', () => {
  it('should render without credentials', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.signDid.sign} data={input}>
        <SignDid
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
  it('should render with credentials', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.signDid.sign} data={input}>
        <SignDid
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
          credentials={mockSharedCredentials}
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
