import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';
import { hasVestedFunds } from '../../utilities/vesting/vesting';

import { Balance } from './Balance';

jest.mock('../../utilities/vesting/vesting');
(hasVestedFunds as jest.Mock).mockResolvedValue(false);

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

describe('Balance', () => {
  it('should render', async () => {
    const { container } = render(<Balance address={mockAddress} />);

    await screen.findByLabelText('KILT Coin');

    expect(container).toMatchSnapshot();
  });

  it('should show balance breakdown with update balance button', async () => {
    const { container } = render(
      <Balance address={mockAddress} breakdown smallDecimals />,
    );

    const showBreakdown = await screen.findByRole('button', {
      name: 'Show balance breakdown',
    });
    userEvent.click(showBreakdown);

    await screen.findByLabelText('Identity has no unlocked funds for update');

    expect(container).toMatchSnapshot();
  });
});
