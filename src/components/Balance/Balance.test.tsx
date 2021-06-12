import userEvent from '@testing-library/user-event';
import BN from 'bn.js';

import { render, screen } from '../../testing/testing';

import { Balance } from './Balance';

import {
  vestingFeeChannel,
  hasVestedFundsChannel,
} from '../../channels/VestingChannels/VestingChannels';
import { existentialDepositChannel } from '../../channels/existentialDepositChannel/existentialDepositChannel';

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

jest.mock('../../channels/existentialDepositChannel/existentialDepositChannel');
jest.mock('../../channels/VestingChannels/VestingChannels');

describe('Balance', () => {
  it('should render', async () => {
    const { container } = render(<Balance address={mockAddress} />);

    await screen.findByLabelText('Kilt coin');

    expect(container).toMatchSnapshot();
  });

  it('should show balance breakdown with update balance button', async () => {
    const { container } = render(<Balance address={mockAddress} breakdown />);

    const showBreakdown = await screen.findByRole('button', {
      name: 'Show balance breakdown',
    });
    userEvent.click(showBreakdown);

    await screen.findByLabelText('Account has no unlocked funds for update');

    expect(container).toMatchSnapshot();
  });

  it('should link to warning page if below existential deposit', async () => {
    (hasVestedFundsChannel.get as jest.Mock).mockResolvedValue(true);
    (vestingFeeChannel.get as jest.Mock).mockResolvedValue(
      new BN('1000000000000000'),
    );
    (existentialDepositChannel.get as jest.Mock).mockResolvedValue(
      new BN('300000000000000'),
    );
    const { container } = render(<Balance address={mockAddress} breakdown />);

    const showBreakdown = await screen.findByRole('button', {
      name: 'Show balance breakdown',
    });
    userEvent.click(showBreakdown);

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
    (hasVestedFundsChannel.get as jest.Mock).mockResolvedValue(true);
    (vestingFeeChannel.get as jest.Mock).mockResolvedValue(
      new BN('500000000000000'),
    );
    (existentialDepositChannel.get as jest.Mock).mockResolvedValue(
      new BN('300000000000000'),
    );
    const { container } = render(<Balance address={mockAddress} breakdown />);

    const showBreakdown = await screen.findByRole('button', {
      name: 'Show balance breakdown',
    });
    userEvent.click(showBreakdown);

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
