import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import {
  identitiesMock,
  render,
  screen,
  waitForDialogUpdate,
  mockDialogShowModal,
} from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentityOverview } from './IdentityOverview';
import { InternalConfigurationContext } from '../../configuration/InternalConfigurationContext';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { credentialsMock } from '../../utilities/credentials/credentials.mock';

jest.mock('../../utilities/credentials/credentials');

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('IdentityOverview', () => {
  it('should render a normal identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/identity/NEW/']}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={NEW} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render upcoming feature modal', async () => {
    mockDialogShowModal();

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    const send = await screen.findByRole('button', { name: 'Send' });
    userEvent.click(send);

    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should render with link to send screen', async () => {
    const { container } = render(
      <InternalConfigurationContext>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Route path={paths.identity.overview}>
            <IdentityOverview identity={identity} />
          </Route>
        </MemoryRouter>
      </InternalConfigurationContext>,
    );

    await screen.findByRole('link', { name: 'Send' });

    expect(container).toMatchSnapshot();
  });

  it('should render with link to credentials screen', async () => {
    (useIdentityCredentials as jest.Mock).mockReturnValue(credentialsMock);

    render(
      <InternalConfigurationContext>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Route path={paths.identity.overview}>
            <IdentityOverview identity={identity} />
          </Route>
        </MemoryRouter>
      </InternalConfigurationContext>,
    );

    expect(
      await screen.findByRole('link', { name: 'Show Credentials' }),
    ).toBeInTheDocument();
  });
});
