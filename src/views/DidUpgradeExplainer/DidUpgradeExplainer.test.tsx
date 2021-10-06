import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

describe('DidUpgradeExplainer', () => {
  it('should render', () => {
    const { container } = render(
      <DidUpgradeExplainer
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
