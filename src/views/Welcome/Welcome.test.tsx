import userEvent from '@testing-library/user-event';

import { AccountsProviderMock, render, screen } from '../../testing/testing';

import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('should match the snapshot without accounts', () => {
    const { container } = render(
      <AccountsProviderMock accounts={{}}>
        <Welcome />
      </AccountsProviderMock>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with an account', () => {
    const { container } = render(<Welcome again />);
    expect(container).toMatchSnapshot();
  });

  it('should enable links after accepting T&C', async () => {
    render(<Welcome again />);

    const createLink = await screen.findByText(/Create/);
    const importLink = await screen.findByText(/Import/);

    expect(createLink).toHaveAttribute('aria-disabled', 'true');
    expect(importLink).toHaveAttribute('aria-disabled', 'true');

    userEvent.click(await screen.findByLabelText(/agree to the/));

    expect(createLink).not.toHaveAttribute('aria-disabled', 'true');
    expect(importLink).not.toHaveAttribute('aria-disabled', 'true');
  });
});
