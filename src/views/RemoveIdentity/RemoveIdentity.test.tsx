import { identitiesMock, render } from '../../testing/testing';

import { RemoveIdentity } from './RemoveIdentity';

const identity =
  identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

describe('RemoveIdentity', () => {
  it('should render', () => {
    const { container } = render(<RemoveIdentity identity={identity} />);
    expect(container).toMatchSnapshot();
  });
});
