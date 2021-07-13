import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '../../testing/testing';
import { useCredential } from '../../utilities/credentials/credentials';
import { credentialsMock } from '../../utilities/credentials/credentials.mock';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

jest.mock('../../utilities/credentials/credentials');

const query = 'claimHash=0xclaimHash';

describe('SaveCredential', () => {
  it('should render', async () => {
    (useCredential as jest.Mock).mockReturnValue(credentialsMock[0]);

    const { container } = render(
      <MemoryRouter initialEntries={[`${paths.popup.save}?${query}`]}>
        <SaveCredential />
      </MemoryRouter>,
    );

    await screen.findByText('Trusted Entity attester');
    expect(container).toMatchSnapshot();
  });
});
