import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing';
import { AddAccount } from './AddAccount';

describe('AddAccount', () => {
  it('should render', async () => {
    const { container } = render(<AddAccount />);
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    const { container } = render(<AddAccount />);
    const openMenuButton = await screen.findByLabelText('Add account');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    userEvent.click(openMenuButton);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');

    expect(container).toMatchSnapshot();
  });
});
