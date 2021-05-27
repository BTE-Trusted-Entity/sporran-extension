import BN from 'bn.js';

import { render, screen } from '../../testing/testing';

import { existentialDepositChannel } from '../../channels/existentialDepositChannel/existentialDepositChannel';
import {
  hasVestedFundsChannel,
  vestingFeeChannel,
} from '../../channels/VestingChannels/VestingChannels';

import { BalanceUpdateLink } from './BalanceUpdateLink';

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

jest.mock('../../channels/existentialDepositChannel/existentialDepositChannel');
jest.mock('../../channels/VestingChannels/VestingChannels');

(hasVestedFundsChannel.get as jest.Mock).mockResolvedValue(true);

describe('BalanceUpdateLink', () => {
  it('should link to warning page if below existential deposit', async () => {
    (vestingFeeChannel.get as jest.Mock).mockResolvedValue(
      new BN('1000000000000000'),
    );
    (existentialDepositChannel.get as jest.Mock).mockResolvedValue(
      new BN('300000000000000'),
    );
    const { container } = render(<BalanceUpdateLink address={mockAddress} />);

    const updateBalance = await screen.findByRole('link', {
      name: 'Update Balance',
    });
    expect(updateBalance).toHaveAttribute(
      'href',
      '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/vest/warning',
    );
    expect(container).toMatchSnapshot();
  });

  it('should link to vesting sign screen if not below existential deposit', async () => {
    (vestingFeeChannel.get as jest.Mock).mockResolvedValue(
      new BN('500000000000000'),
    );
    (existentialDepositChannel.get as jest.Mock).mockResolvedValue(
      new BN('300000000000000'),
    );
    const { container } = render(<BalanceUpdateLink address={mockAddress} />);

    const updateBalance = await screen.findByRole('link', {
      name: 'Update Balance',
    });
    expect(updateBalance).toHaveAttribute(
      'href',
      '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/vest/sign',
    );
    expect(container).toMatchSnapshot();
  });
});
