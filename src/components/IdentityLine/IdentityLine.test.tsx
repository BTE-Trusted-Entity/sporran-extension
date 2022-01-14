import { identitiesMock, render } from '../../testing/testing';

import { IdentityLine } from './IdentityLine';

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('IdentityLine', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<IdentityLine identity={identity} />);
    expect(container).toMatchSnapshot();
  });
});
