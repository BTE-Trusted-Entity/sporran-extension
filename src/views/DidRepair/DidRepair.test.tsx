import { BalanceUtils } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { getFee } from '../../utilities/didRepair/didRepair';

import { DidRepair } from './DidRepair';

jest.mock('../../utilities/didRepair/didRepair', () => ({
  getFee: jest.fn(),
}));
jest.mocked(getFee).mockResolvedValue(BalanceUtils.toFemtoKilt(0.01));

describe('DidRepair', () => {
  it('should render', async () => {
    const { container } = render(
      <DidRepair
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
