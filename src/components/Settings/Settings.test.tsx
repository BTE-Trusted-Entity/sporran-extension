import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '../../testing';
import { AccountsProviderMock } from '../../testing/AccountsProviderMock';
import { waitForHasSavedPasswords } from '../../testing/hasSavedPasswords.mock';
import { Settings } from './Settings';

describe('Settings', () => {
  it('should render', async () => {
    const { container } = render(<Settings />);
    await waitForHasSavedPasswords();
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/account/foo']}>
        <Settings />
      </MemoryRouter>,
    );
    const openMenuButton = await screen.findByLabelText('Settings');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    userEvent.click(openMenuButton);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { name: 'Forget current account' }),
    ).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');

    await waitForHasSavedPasswords();

    expect(container).toMatchSnapshot();
  });

  it('should not render account options if there are no accounts', async () => {
    render(
      <AccountsProviderMock accounts={{}}>
        <Settings />
      </AccountsProviderMock>,
    );
    userEvent.click(await screen.findByLabelText('Settings'));

    expect(
      screen.queryByRole('menuitem', { name: 'Forget current account' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', {
        name: 'Reset password for current account',
      }),
    ).not.toBeInTheDocument();

    await waitForHasSavedPasswords();
  });
});
