import { render } from '../../testing/testing';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { credentialsMock } from '../../utilities/credentials/credentials.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { ShareCredential } from './ShareCredential';

jest.mock('../../utilities/credentials/credentials');
(useIdentityCredentials as jest.Mock).mockReturnValue(credentialsMock);

const mockClaimRequest = [
  {
    cTypeHash:
      '0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2',
  },
];

describe('ShareCredential', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.share} data={mockClaimRequest}>
        <ShareCredential />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
