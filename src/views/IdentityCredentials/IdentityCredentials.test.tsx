import { Attestation } from '@kiltprotocol/core';

import { identitiesMock, render } from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { parseDidUrl, sameFullDid } from '../../utilities/did/did';
import { waitForDownloadInfo } from '../../utilities/showDownloadInfoStorage/showDownloadInfoStorage.mock';
import { waitForPresentationInfo } from '../../utilities/showPresentationInfoStorage/showPresentationInfoStorage.mock';
import {
  credentialsMock,
  CredentialsProviderMock,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { IdentityCredentials } from './IdentityCredentials';

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUrl).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUrl>);
jest.mocked(sameFullDid).mockReturnValue(true);

jest.mock('@kiltprotocol/core', () => ({ Attestation: { query: jest.fn() } }));
jest.mocked(Attestation.query).mockResolvedValue(null);

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

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
