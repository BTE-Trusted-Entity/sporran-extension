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
    const menu = await screen.findByRole('menu');
    const openMenuButton = await screen.findByLabelText(
      'open account options menu',
    );
    expect(menu).toHaveClass('hidden');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');

    userEvent.click(openMenuButton);

    expect(menu).not.toHaveClass('hidden');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
