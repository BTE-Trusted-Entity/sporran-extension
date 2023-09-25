import { userEvent } from '@testing-library/user-event';

import { identitiesMock, render, screen } from '../../testing/testing';

import { IdentityOptions } from './IdentityOptions';

const onEdit = jest.fn();

const props = {
  identity: identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'],
  onEdit,
};

describe('AddIdentity', () => {
  it('should render', async () => {
    const { container } = render(<IdentityOptions {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    const { container } = render(<IdentityOptions {...props} />);
    const openMenuButton = await screen.findByLabelText('Identity options');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(openMenuButton);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');

    expect(container).toMatchSnapshot();
  });
});
