import { identitiesMock, render } from '../../testing/testing';

import { IdentityLine } from './IdentityLine';

const identity =
  identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

describe('IdentityLine', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<IdentityLine identity={identity} />);
    expect(container).toMatchSnapshot();
  });
});
