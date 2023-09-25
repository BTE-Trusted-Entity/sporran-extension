import { userEvent } from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { Balance } from './Balance';

const mockAddress = '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(false);

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

    expect(container).toMatchSnapshot();
  });
});
