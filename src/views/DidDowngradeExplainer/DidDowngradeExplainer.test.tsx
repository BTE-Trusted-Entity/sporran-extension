import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { DidDowngradeExplainer } from './DidDowngradeExplainer';

describe('DidDowngradeExplainer', () => {
  it('should render', () => {
    mockIsFullDid(true);
    const { container } = render(
      <DidDowngradeExplainer
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
