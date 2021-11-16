import { render } from '../../testing/testing';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { CredentialCard } from './CredentialCard';

describe('CredentialCard', () => {
  it('should render', async () => {
    const { container } = render(
      <CredentialCard credential={credentialsMock[0]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
