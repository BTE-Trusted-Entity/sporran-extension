import { MemoryRouter, Route } from 'react-router-dom';

import {
  moreIdentitiesMock as identities,
  render,
  screen,
} from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { InternalConfigurationContext } from '../../configuration/InternalConfigurationContext';
import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import { notDownloaded } from '../../utilities/credentials/CredentialsProvider.mock';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';

import { IdentityOverview } from './IdentityOverview';

jest.mock('../../utilities/useSubscanHost/useSubscanHost');
jest.mock('../../utilities/credentials/credentials');
jest.mock('../../utilities/useWeb3Name/useWeb3Name');
jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(false);
jest.mock('../../utilities/did/useIsOnChainDidDeleted');

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

const fullDidIdentity =
  identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

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

  it('should show web3name', async () => {
    jest.mocked(useWeb3Name).mockReturnValueOnce('fancy-name');

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${fullDidIdentity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should show on-chain DID removed', async () => {
    mockIsFullDid(false);
    jest.mocked(useIsOnChainDidDeleted).mockReturnValue(true);
    jest.mocked(useWeb3Name).mockReturnValueOnce('fancy-name');

    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/identity/4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB',
        ]}
      >
        <Route path={paths.identity.overview}>
          <IdentityOverview
            identity={
              identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
            }
          />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
