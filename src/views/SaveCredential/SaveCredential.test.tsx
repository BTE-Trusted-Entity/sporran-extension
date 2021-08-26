import { render, screen } from '../../testing/testing';
import { useCredential } from '../../utilities/credentials/credentials';
import {
  credentialsMock,
  mockAttestation,
} from '../../utilities/credentials/credentials.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

jest.mock('../../utilities/credentials/credentials');

describe('SaveCredential', () => {
  it('should render', async () => {
    (useCredential as jest.Mock).mockReturnValue(credentialsMock[0]);

    const { container } = render(
      <PopupTestProvider path={paths.popup.save} data={mockAttestation}>
        <SaveCredential />
      </PopupTestProvider>,
    );

    await screen.findByText('Trusted Entity attester');
    expect(container).toMatchSnapshot();
  });
});
