import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock as identities, render } from '../../testing/testing';

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
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
