import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { identitiesMock, render, screen } from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentityOverview } from './IdentityOverview';
import { InternalConfigurationContext } from '../../configuration/InternalConfigurationContext';
import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';
import { mockIsFullDid } from '../../utilities/did/did.mock';

jest.mock('../../utilities/credentials/credentials');
jest.mock('../../utilities/useSubscanHost/useSubscanHost');

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const fullDidIdentity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('IdentityOverview', () => {
  it('should render a normal identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Routes>
          <Route
            path={paths.identity.overview}
            element={<IdentityOverview identity={identity} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/identity/NEW/']}>
        <Routes>
          <Route
            path={paths.identity.overview}
            element={<IdentityOverview identity={NEW} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with link to send screen', async () => {
    (useSubscanHost as jest.Mock).mockReturnValue(
      'https://kilt-testnet.subscan.io',
    );

    const { container } = render(
      <InternalConfigurationContext>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Routes>
            <Route
              path={paths.identity.overview}
              element={<IdentityOverview identity={identity} />}
            />
          </Routes>
        </MemoryRouter>
      </InternalConfigurationContext>,
    );

    await screen.findByRole('link', { name: 'Send' });

    expect(container).toMatchSnapshot();
  });

  it('should render with link to credentials screen', async () => {
    render(
      <InternalConfigurationContext>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Routes>
            <Route
              path={paths.identity.overview}
              element={<IdentityOverview identity={identity} />}
            />
          </Routes>
        </MemoryRouter>
      </InternalConfigurationContext>,
    );

    expect(
      await screen.findByRole('link', { name: 'Show Credentials' }),
    ).toBeInTheDocument();
  });

  it('should render full DID identity', async () => {
    mockIsFullDid(true);

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${fullDidIdentity.address}/`]}>
        <Routes>
          <Route
            path={paths.identity.overview}
            element={<IdentityOverview identity={fullDidIdentity} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
