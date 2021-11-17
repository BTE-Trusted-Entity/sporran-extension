import { render, screen } from '../../testing/testing';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { CredentialCard } from './CredentialCard';
import userEvent from '@testing-library/user-event';

describe('CredentialCard', () => {
  it('should render collapsed card', async () => {
    const { container } = render(
      <CredentialCard
        credential={credentialsMock[0]}
        listRef={{ current: null }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render expanded card', async () => {
    const { container } = render(
      <CredentialCard
        credential={credentialsMock[0]}
        listRef={{ current: null }}
      />,
    );
    userEvent.click(
      await screen.findByRole('button', {
        name: 'Email Credential mockEmail@mock.mock',
      }),
    );
    expect(container).toMatchSnapshot();
  });
});
