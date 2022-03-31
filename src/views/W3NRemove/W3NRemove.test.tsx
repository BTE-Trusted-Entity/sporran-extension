import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { W3NRemove } from './W3NRemove';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');
jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
  return {
    getFullDidDetails: {},
    'Web3NameRemove.getFee': BalanceUtils.toFemtoKilt(0.01),
    'Web3NameRemove.getDepositData': {
      owner: identity.address,
      amount: BalanceUtils.toFemtoKilt(2),
    },
  }[name];
});

describe('W3NRemove', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<W3NRemove identity={identity} />);
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
