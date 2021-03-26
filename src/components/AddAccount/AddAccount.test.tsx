import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing';
import { AddAccount } from './AddAccount';

describe('AddAccount', () => {
  it('should render', async () => {
    const { container } = render(<AddAccount />);
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    render(<AddAccount />);
    const menu = await screen.findByRole('menu');
    const openMenuButton = await screen.findByLabelText(
      'open add account menu',
    );
    expect(menu).toHaveClass('hidden');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');

    userEvent.click(openMenuButton);

    expect(menu).not.toHaveClass('hidden');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
