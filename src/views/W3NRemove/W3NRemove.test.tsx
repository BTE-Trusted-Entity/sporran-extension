import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { W3NRemove } from './W3NRemove';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');

const swrDataMock: Record<string, unknown> = {
  getFullDidDetails: {},
  'Web3NameRemove.getFee': BalanceUtils.toFemtoKilt(0.01),
  'Web3NameRemove.getDepositWeb3Name': {
    owner: identity.address,
    amount: BalanceUtils.toFemtoKilt(2),
  },
};

describe('W3NRemove', () => {
  it('should show refund amount including deposit if promo was not used', async () => {
    jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
      return swrDataMock[name];
    });
    const { container } = render(<W3NRemove identity={identity} />);
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should show only fee amount if promo was used', async () => {
    jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
      return {
        ...swrDataMock,
        'Web3NameRemove.getDepositWeb3Name': {
          owner: 'some other deposit owner',
          amount: BalanceUtils.toFemtoKilt(2),
        },
      }[name];
    });
    const { container } = render(<W3NRemove identity={identity} />);
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
