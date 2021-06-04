import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';

import { Balance } from './Balance';

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

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

    await screen.findByRole('button', {
      name: 'Account has no unlocked funds for update',
    });

    expect(container).toMatchSnapshot();
  });
});
