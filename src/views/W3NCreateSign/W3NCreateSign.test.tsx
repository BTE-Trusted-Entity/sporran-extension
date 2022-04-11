import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { W3NCreateSign } from './W3NCreateSign';

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');
jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
  return {
    getFullDidDetails: {},
    'W3NCreateSign.getFee': BalanceUtils.toFemtoKilt(0.01),
    'W3NCreateSign.getDeposit': { amount: BalanceUtils.toFemtoKilt(2) },
  }[name];
});

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('W3NCreateSign', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <W3NCreateSign identity={identity} web3name="fancy-name" />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
