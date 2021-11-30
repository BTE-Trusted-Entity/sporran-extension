import { identitiesMock, render } from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { parseDidUrl } from '../../utilities/did/did';
import {
  credentialsMock,
  CredentialsProviderMock,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { IdentityCredentials } from './IdentityCredentials';

jest.mock('../../utilities/did/did');

(parseDidUrl as jest.Mock).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
});

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('IdentityCredentials', () => {
  it('should render', () => {
    const { container } = render(<IdentityCredentials identity={identity} />);
    expect(container).toMatchSnapshot();
  });

  it('should not render credentials for new identity', () => {
    const { container } = render(<IdentityCredentials identity={NEW} />);
    expect(container).toMatchSnapshot();
  });

  it('should render when no credentials', () => {
    const { container } = render(
      <CredentialsProviderMock credentials={[]}>
        <IdentityCredentials identity={identity} />
      </CredentialsProviderMock>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should expand last credential when there are less than 7', async () => {
    const { container } = render(
      <CredentialsProviderMock credentials={credentialsMock.slice(0, 3)}>
        <IdentityCredentials identity={identity} />
      </CredentialsProviderMock>,
    );
    expect(container).toMatchSnapshot();
  });
});
