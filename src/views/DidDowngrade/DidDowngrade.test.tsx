import BN from 'bn.js';
import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { getDeposit, getFee } from '../../utilities/didDowngrade/didDowngrade';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { DidDowngrade } from './DidDowngrade';

jest.mock('../../utilities/didDowngrade/didDowngrade', () => ({
  getFee: jest.fn(),
  getDeposit: jest.fn(),
}));
(getFee as jest.Mock).mockResolvedValue(new BN(1e13));
(getDeposit as jest.Mock).mockResolvedValue(new BN(1e15));

describe('DidDowngrade', () => {
  it('should render', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <DidDowngrade
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
