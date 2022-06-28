import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities, render } from '../../testing/testing';

import '../../components/useCopyButton/useCopyButton.mock';

import { parseDidUri } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';

import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

import { DidManage } from './DidManage';

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as unknown as ReturnType<typeof parseDidUri>);

jest.mock('../../utilities/useWeb3Name/useWeb3Name');

describe('DidManage', () => {
  it('should match the snapshot without web3name', async () => {
    jest.mocked(useWeb3Name).mockReturnValue(undefined);
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
        ]}
      >
        <Route path={paths.identity.did.manage.start}>
          <DidManage
            identity={
              identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with web3name', async () => {
    jest.mocked(useWeb3Name).mockReturnValue('fancy-name');
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
        ]}
      >
        <Route path={paths.identity.did.manage.start}>
          <DidManage
            identity={
              identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
