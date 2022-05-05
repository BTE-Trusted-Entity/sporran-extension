import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';
import { hasVestedFunds } from '../../utilities/hasVestedFunds/hasVestedFunds';

import { Balance } from './Balance';

jest.mock('../../utilities/hasVestedFunds/hasVestedFunds');
jest.mocked(hasVestedFunds).mockResolvedValue(false);

const mockAddress = '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';

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
    await userEvent.click(showBreakdown);

    await screen.findByLabelText('Identity has no unlocked funds for update');

    expect(container).toMatchSnapshot();
  });
});
