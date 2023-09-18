import { BalanceUtils, DidServiceEndpoint } from '@kiltprotocol/sdk-js';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { getDepositServiceEndpoint } from '../../utilities/getDeposit/getDeposit';

import { DidEndpointsSign } from './DidEndpointsSign';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const endpoint: DidServiceEndpoint = {
  serviceEndpoint: ['https://sporran.org/'],
  type: ['Some Type'],
  id: '#123456',
};

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(BalanceUtils.toFemtoKilt(0.01));

jest.mock('../../utilities/getDeposit/getDeposit');
jest
  .mocked(getDepositServiceEndpoint)
  .mockReturnValue({ amount: BalanceUtils.toFemtoKilt(0.2) });

describe('DidEndpointsSign', () => {
  it('should match the snapshot when adding', async () => {
    const { container } = render(
      <DidEndpointsSign type="add" identity={identity} endpoint={endpoint} />,
    );

    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when removing', async () => {
    const { container } = render(
      <DidEndpointsSign
        type="remove"
        identity={identity}
        endpoint={endpoint}
      />,
    );

    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
