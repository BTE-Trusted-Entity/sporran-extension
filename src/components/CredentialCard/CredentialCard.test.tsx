import userEvent from '@testing-library/user-event';
import { render, screen } from '../../testing/testing';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { CredentialCard } from './CredentialCard';

describe('CredentialCard', () => {
  it('should render collapsed card', async () => {
    const { container } = render(
      <CredentialCard credential={credentialsMock[0]} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render expanded card', async () => {
    const { container } = render(
      <CredentialCard credential={credentialsMock[0]} />,
    );
    userEvent.click(
      await screen.findByRole('button', {
        name: 'Email Credential mockEmail@mock.mock',
      }),
    );
    expect(container).toMatchSnapshot();
  });
});
