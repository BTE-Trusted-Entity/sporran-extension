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
    expect(menu).not.toHaveClass('visible');

    // Both tests fail. Why?
    expect(menu).not.toBeVisible();
    expect(menu).toHaveStyle('visibility: hidden');

    userEvent.click(await screen.findByRole('button', { name: '+' }));
    expect(menu).toHaveClass('visible');
    expect(menu).toBeVisible();
  });
});
