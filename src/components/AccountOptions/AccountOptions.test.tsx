import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing';
import { AccountOptions } from './AccountOptions';

const onEdit = jest.fn();

const props = {
  onEdit,
};

describe('AddAccount', () => {
  it('should render', async () => {
    const { container } = render(<AccountOptions {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    render(<AccountOptions {...props} />);
    const openMenuButton = await screen.findByLabelText('Account options');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    userEvent.click(openMenuButton);

    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
