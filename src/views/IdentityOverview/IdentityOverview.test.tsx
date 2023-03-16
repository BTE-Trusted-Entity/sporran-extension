import { MemoryRouter, Route } from 'react-router-dom';

import { Did } from '@kiltprotocol/sdk-js';

import {
  moreIdentitiesMock as identities,
  render,
} from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import {
  credentialsMock,
  CredentialsProviderMock,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { waitForDownloadInfo } from '../../utilities/showDownloadInfoStorage/showDownloadInfoStorage.mock';

import { IdentityOverview } from './IdentityOverview';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(false);
jest.mocked(Did.parse).mockReturnValue({} as ReturnType<typeof Did.parse>);

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

describe('IdentityOverview', () => {
  it('should render a normal identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    await waitForDownloadInfo();
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
    await waitForDownloadInfo();
    expect(container).toMatchSnapshot();
  });

  it('should render when no credentials', async () => {
    const { container } = render(
      <CredentialsProviderMock credentials={[]}>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Route path={paths.identity.overview}>
            <IdentityOverview identity={identity} />
          </Route>
        </MemoryRouter>
      </CredentialsProviderMock>,
    );
    await waitForDownloadInfo();
    expect(container).toMatchSnapshot();
  });

  it('should expand last credential when there are less than 7', async () => {
    const { container } = render(
      <CredentialsProviderMock credentials={credentialsMock.slice(0, 3)}>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Route path={paths.identity.overview}>
            <IdentityOverview identity={identity} />
          </Route>
        </MemoryRouter>
      </CredentialsProviderMock>,
    );
    await waitForDownloadInfo();
    expect(container).toMatchSnapshot();
  });
});
