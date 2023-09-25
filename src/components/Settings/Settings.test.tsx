import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '../../testing/testing';
import { IdentitiesProviderMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForHasSavedPasswords } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { InternalConfigurationContext } from '../../configuration/InternalConfigurationContext';

import { Settings } from './Settings';

describe('Settings', () => {
  it('should render', async () => {
    const { container } = render(<Settings />);
    await waitForHasSavedPasswords();
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
        ]}
      >
        <Settings />
      </MemoryRouter>,
    );
    const openMenuButton = await screen.findByLabelText('Settings');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(openMenuButton);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { name: 'Remove Current Identity' }),
    ).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');

    await waitForHasSavedPasswords();

    expect(container).toMatchSnapshot();
  });

  it('should not render identity options when creating identity', async () => {
    render(
      <MemoryRouter initialEntries={['/identity/NEW']}>
        <Settings />
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByLabelText('Settings'));

    expect(
      screen.queryByRole('menuitem', { name: 'Forget current identity' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', {
        name: 'Reset password for current identity',
      }),
    ).not.toBeInTheDocument();

    await waitForHasSavedPasswords();
  });

  it('should not render identity options if there are no identities', async () => {
    render(
      <IdentitiesProviderMock identities={{}}>
        <Settings />
      </IdentitiesProviderMock>,
    );
    await userEvent.click(await screen.findByLabelText('Settings'));

    expect(
      screen.queryByRole('menuitem', { name: 'Forget current identity' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', {
        name: 'Reset password for current identity',
      }),
    ).not.toBeInTheDocument();

    await waitForHasSavedPasswords();
  });

  it('should render the endpoint item in the internal build', async () => {
    const { container } = render(
      <InternalConfigurationContext>
        <Settings />
      </InternalConfigurationContext>,
    );
    await userEvent.click(await screen.findByLabelText('Settings'));

    expect(
      await screen.findByRole('menuitem', { name: 'Custom Endpoint' }),
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
