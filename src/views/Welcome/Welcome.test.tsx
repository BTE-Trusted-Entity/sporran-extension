import { userEvent } from '@testing-library/user-event';

import { identitiesMock, render, screen } from '../../testing/testing';
import {
  useCurrentIdentity,
  useIdentities,
} from '../../utilities/identities/identities';

import { Welcome } from './Welcome';

jest.mock('../../utilities/identities/identities');
jest
  .mocked(useCurrentIdentity)
  .mockReturnValue('4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1');

describe('Welcome', () => {
  it('should match the snapshot without identities', () => {
    jest.mocked(useIdentities).mockReturnValue({ data: {} });
    const { container } = render(<Welcome />);
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with an identity', () => {
    jest.mocked(useIdentities).mockReturnValue({ data: identitiesMock });
    const { container } = render(<Welcome again />);
    expect(container).toMatchSnapshot();
  });

  it('should enable links after accepting T&C', async () => {
    jest.mocked(useIdentities).mockReturnValue({ data: identitiesMock });
    render(<Welcome again />);

    const createLink = await screen.findByText(/Create/);
    const importLink = await screen.findByText(/Import/);

    expect(createLink).toHaveAttribute('aria-disabled', 'true');
    expect(importLink).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(await screen.findByLabelText(/agree to the/));

    expect(createLink).not.toHaveAttribute('aria-disabled', 'true');
    expect(importLink).not.toHaveAttribute('aria-disabled', 'true');
  });
});
