import { MemoryRouter } from 'react-router-dom';
import { userEvent } from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';

import { AddIdentity } from './AddIdentity';

describe('AddIdentity', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
        ]}
      >
        <AddIdentity />
      </MemoryRouter>,
    );

    await userEvent.click(await screen.findByLabelText('Add'));

    expect(container).toMatchSnapshot();
  });

  it('should not render while creating identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/identity/NEW']}>
        <AddIdentity />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render when no identities', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <AddIdentity />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
