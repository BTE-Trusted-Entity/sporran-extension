import { MemoryRouter, Route } from 'react-router-dom';

import { act } from '@testing-library/react';

import { identitiesMock, render, screen } from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { InternalConfigurationContext } from '../../configuration/InternalConfigurationContext';
import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { notDownloaded } from '../../utilities/credentials/CredentialsProvider.mock';

import { useIdentityCredentials } from '../../utilities/credentials/credentials';

import { legacyIdentity } from '../../utilities/identities/IdentitiesProvider.mock';

import { needLegacyDidCrypto } from '../../utilities/did/did';

import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

import { IdentityOverview } from './IdentityOverview';

jest.mock('../../utilities/useSubscanHost/useSubscanHost');

jest.mock('../../utilities/credentials/credentials');

jest.mock('../../utilities/useWeb3Name/useWeb3Name');

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const fullDidIdentity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

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

  it('should render with link to send screen', async () => {
    jest
      .mocked(useSubscanHost)
      .mockReturnValue('https://kilt-testnet.subscan.io');

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

  it('should render full DID identity', async () => {
    mockIsFullDid(true);

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${fullDidIdentity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={fullDidIdentity} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should show notification for not backed up credentials', async () => {
    jest.mocked(useIdentityCredentials).mockReturnValue(notDownloaded);

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should prompt to update legacy DID', async () => {
    const legacyPromise = Promise.resolve(true);

    jest.mocked(needLegacyDidCrypto).mockReturnValue(legacyPromise);

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${legacyIdentity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={legacyIdentity} />
        </Route>
      </MemoryRouter>,
    );

    await act(async () => {
      await legacyPromise;
    });

    expect(container).toMatchSnapshot();
  });

  it('should show web3name', async () => {
    jest.mocked(useWeb3Name).mockReturnValue('fancy-name');

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${fullDidIdentity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
