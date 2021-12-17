import { render, screen } from '../../testing/testing';
import { mockAttestation } from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

describe('SaveCredential', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.save} data={mockAttestation}>
        <SaveCredential />
      </PopupTestProvider>,
    );

    await screen.findByText('Trusted Entity attester');

    expect(container).toMatchSnapshot();
  });
});
