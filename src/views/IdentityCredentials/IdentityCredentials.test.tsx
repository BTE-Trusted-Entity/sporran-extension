import { identitiesMock, render } from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { parseDidUri } from '../../utilities/did/did';
import { waitForDownloadInfo } from '../../utilities/showDownloadInfoStorage/showDownloadInfoStorage.mock';
import { waitForPresentationInfo } from '../../utilities/showPresentationInfoStorage/showPresentationInfoStorage.mock';
import {
  credentialsMock,
  CredentialsProviderMock,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { IdentityCredentials } from './IdentityCredentials';

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as unknown as ReturnType<typeof parseDidUri>);

const identity =
  identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

describe('IdentityCredentials', () => {
  it('should render', async () => {
    const { container } = render(<IdentityCredentials identity={identity} />);
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should not render credentials for new identity', async () => {
    const { container } = render(<IdentityCredentials identity={NEW} />);
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should render when no credentials', async () => {
    const { container } = render(
      <CredentialsProviderMock credentials={[]}>
        <IdentityCredentials identity={identity} />
      </CredentialsProviderMock>,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });

  it('should expand last credential when there are less than 7', async () => {
    const { container } = render(
      <CredentialsProviderMock credentials={credentialsMock.slice(0, 3)}>
        <IdentityCredentials identity={identity} />
      </CredentialsProviderMock>,
    );
    await waitForDownloadInfo();
    await waitForPresentationInfo();
    expect(container).toMatchSnapshot();
  });
});
