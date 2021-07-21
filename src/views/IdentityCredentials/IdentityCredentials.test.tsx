import { identitiesMock, render } from '../../testing/testing';

import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { credentialsMock } from '../../utilities/credentials/credentials.mock';

import { IdentityCredentials } from './IdentityCredentials';

jest.mock('../../utilities/credentials/credentials');
(useIdentityCredentials as jest.Mock).mockReturnValue(credentialsMock);

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('IdentityCredentials', () => {
  it('should render', async () => {
    const { container } = render(<IdentityCredentials identity={identity} />);
    expect(container).toMatchSnapshot();
  });
});
