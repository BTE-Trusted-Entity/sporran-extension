import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities, render } from '../../testing/testing';

import '../../components/useCopyButton/useCopyButton.mock';

import { parseDidUri } from '../../utilities/did/did';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';
import { generatePath, paths } from '../paths';

import { DidManage } from './DidManage';

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUri>);

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');

describe('DidManage', () => {
  it('should match the snapshot without web3name', async () => {
    jest.mocked(useSwrDataOrThrow).mockReturnValue(undefined);
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
        ]}
      >
        <Route path={paths.identity.did.manage.start}>
          <DidManage
            identity={
              identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with web3name', async () => {
    jest.mocked(useSwrDataOrThrow).mockReturnValue('fancy-name');
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
        ]}
      >
        <Route path={paths.identity.did.manage.start}>
          <DidManage
            identity={
              identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
