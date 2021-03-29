import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing';
import { Settings } from './Settings';

describe('AddAccount', () => {
  it('should render', async () => {
    const { container } = render(<Settings />);
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    const { container } = render(<Settings />);
    const openMenuButton = await screen.findByLabelText('Settings');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    userEvent.click(openMenuButton);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');

    expect(container).toMatchSnapshot();
  });
});
