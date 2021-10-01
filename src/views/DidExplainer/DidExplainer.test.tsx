import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidExplainer } from './DidExplainer';

describe('DidExplainer', () => {
  it('should render', () => {
    const { container } = render(
      <DidExplainer
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
