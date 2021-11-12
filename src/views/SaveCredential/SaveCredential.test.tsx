import userEvent from '@testing-library/user-event';
import { render, screen } from '../../testing/testing';
import {
  getCredential,
  saveCredential,
} from '../../utilities/credentials/credentials';
import {
  credentialsMock,
  mockAttestation,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

jest.mock('../../utilities/credentials/credentials');

describe('SaveCredential', () => {
  it('should render', async () => {
    (getCredential as jest.Mock).mockReturnValue(credentialsMock[0]);

    const { container } = render(
      <PopupTestProvider path={paths.popup.save} data={mockAttestation}>
        <SaveCredential />
      </PopupTestProvider>,
    );

    await screen.findByText('Trusted Entity attester');

    userEvent.type(
      await screen.findByLabelText('Give your credential a name:'),
      'Blah',
    );
    expect(saveCredential).toHaveBeenCalledTimes(5);

    expect(container).toMatchSnapshot();
  });
});
