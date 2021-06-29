import { render } from '../../testing/testing';
import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { UnlockVestedFunds } from './UnlockVestedFunds';

describe('UnlockVestedFunds', () => {
  it('should render', async () => {
    const { container } = render(
      <UnlockVestedFunds
        identity={
          identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
