import { render, screen } from '../../testing/testing';
import { mockAttestations } from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

describe('SaveCredential', () => {
  it('should render for not downloaded credential', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.save}
        data={mockAttestations.notDownloaded}
      >
        <SaveCredential />
      </PopupTestProvider>,
    );

    await screen.findByText('Trusted Entity attester');

    expect(container).toMatchSnapshot();
  });
  it('should render for downloaded credential', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.save}
        data={mockAttestations.downloaded}
      >
        <SaveCredential />
      </PopupTestProvider>,
    );

    await screen.findByText('Trusted Entity attester');

    expect(container).toMatchSnapshot();
  });
});
