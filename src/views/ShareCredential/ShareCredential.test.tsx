import { MemoryRouter } from 'react-router-dom';

import { render } from '../../testing/testing';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { credentialsMock } from '../../utilities/credentials/credentials.mock';
import { paths } from '../paths';

import { ShareCredential } from './ShareCredential';

jest.mock('../../utilities/credentials/credentials');
(useIdentityCredentials as jest.Mock).mockReturnValue(credentialsMock);

const query =
  'cTypeHashes=["0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2"]';

describe('ShareCredential', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${paths.popup.share}?${query}`]}>
        <ShareCredential />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
