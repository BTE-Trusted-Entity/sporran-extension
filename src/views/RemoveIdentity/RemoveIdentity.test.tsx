import { identitiesMock, render } from '../../testing/testing';

import { RemoveIdentity } from './RemoveIdentity';

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('RemoveIdentity', () => {
  it('should render', () => {
    const { container } = render(<RemoveIdentity identity={identity} />);
    expect(container).toMatchSnapshot();
  });
});
