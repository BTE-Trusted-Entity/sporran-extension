import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock as identities, render } from '../../testing/testing';

import '../../components/useCopyButton/useCopyButton.mock';

import { generatePath, paths } from '../paths';

import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

import { W3NManage } from './W3NManage';

jest.mock('../../utilities/useWeb3Name/useWeb3Name');

describe('W3NManage', () => {
  it('should render', async () => {
    jest.mocked(useWeb3Name).mockReturnValue('fancy-name');
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.web3name.manage.start, {
            address: 'FOO',
          }),
        ]}
      >
        <Route path={paths.identity.web3name.manage.start}>
          <W3NManage
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
