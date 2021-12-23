import userEvent from '@testing-library/user-event';

import { identitiesMock, render, screen } from '../../testing/testing';

import {
  credentialsMock,
  mockRequestCredential,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../../views/paths';

import { CredentialCard } from './CredentialCard';
import { ShareCredentialCard } from './ShareCredentialCard';

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

  it('should render collapased share credential card', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <ShareCredentialCard
          credential={credentialsMock[0]}
          identity={identitiesMock[0]}
          onSelect={jest.fn()}
        />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render expanded share credential card', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <ShareCredentialCard
          credential={credentialsMock[0]}
          identity={identitiesMock[0]}
          isSelected
          onSelect={jest.fn()}
        />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
