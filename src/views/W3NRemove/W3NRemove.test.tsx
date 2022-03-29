import BN from 'bn.js';

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
    'Web3NameRemove.getFee': new BN(1e13),
    'Web3NameRemove.getDepositData': {
      owner: identity.address,
      amount: new BN(2e15),
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
