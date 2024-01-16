import type { DidDocument } from '@kiltprotocol/types';

import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useDepositWeb3Name } from '../../utilities/getDeposit/getDeposit';
import { useFullDidDocument } from '../../utilities/did/did';

import { W3NRemove } from './W3NRemove';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

jest.mock('../../utilities/did/did');
jest.mocked(useFullDidDocument).mockReturnValue({} as DidDocument);

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(BalanceUtils.toFemtoKilt(0.01));

jest.mock('../../utilities/getDeposit/getDeposit');

describe('W3NRemove', () => {
  it('should show refund amount including deposit if promo was not used', async () => {
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: identity.address,
      amount: BalanceUtils.toFemtoKilt(2),
    });

    const { container } = render(<W3NRemove identity={identity} />);
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should show only fee amount if promo was used', async () => {
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: '4some other deposit owner',
      amount: BalanceUtils.toFemtoKilt(2),
    });

    const { container } = render(<W3NRemove identity={identity} />);
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
