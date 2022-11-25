import { identitiesMock, render, screen } from '../../testing/testing';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import {
  credentialsMock,
  mockRequestCredential,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { paths } from '../paths';

import { Selected } from '../ShareCredential/ShareCredential';

import { ShareCredentialSign } from './ShareCredentialSign';

const mockSelected: Selected = {
  sporranCredential: credentialsMock[0],
  identity: identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'],
  sharedContents: ['Email'],
};

describe('ShareCredentialSign', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.sign}
        data={mockRequestCredential}
      >
        <ShareCredentialSign
          onCancel={jest.fn()}
          selected={mockSelected}
          popupData={mockRequestCredential}
        />
      </PopupTestProvider>,
    );

    await waitForGetPassword();
    expect(screen.queryByText('Mock Name')).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
