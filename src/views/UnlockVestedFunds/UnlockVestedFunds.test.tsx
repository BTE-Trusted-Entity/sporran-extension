import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { UnlockVestedFunds } from './UnlockVestedFunds';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(BalanceUtils.toFemtoKilt(0.01));

describe('UnlockVestedFunds', () => {
  it('should render', async () => {
    const { container } = render(
      <UnlockVestedFunds
        identity={
          identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
