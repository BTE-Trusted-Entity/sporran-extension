import { identitiesMock as identities, render } from '../../testing/testing';

import { mockIsFullDid } from '../../utilities/did/did.mock';

import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

import { DidDowngradeWarningWeb3Name } from './DidDowngradeWarningWeb3Name';

jest.mock('../../utilities/useWeb3Name/useWeb3Name');
jest.mocked(useWeb3Name).mockReturnValue('fancy-name');

describe('DidDowngradeWarningWeb3Name', () => {
  it('should render', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <DidDowngradeWarningWeb3Name
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
