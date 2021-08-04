import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '../../testing/testing';
import { useCredential } from '../../utilities/credentials/credentials';
import {
  credentialsMock,
  mockAttestation,
} from '../../utilities/credentials/credentials.mock';
import { jsonToBase64 } from '../../utilities/popups/usePopupData';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

jest.mock('../../utilities/credentials/credentials');

const encodedData = jsonToBase64(mockAttestation);

describe('SaveCredential', () => {
  it('should render', async () => {
    (useCredential as jest.Mock).mockReturnValue(credentialsMock[0]);

    const { container } = render(
      <MemoryRouter
        initialEntries={[`${paths.popup.save}?data=${encodedData}`]}
      >
        <SaveCredential />
      </MemoryRouter>,
    );

    await screen.findByText('Trusted Entity attester');
    expect(container).toMatchSnapshot();
  });
});
