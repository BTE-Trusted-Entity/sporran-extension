import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

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
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
