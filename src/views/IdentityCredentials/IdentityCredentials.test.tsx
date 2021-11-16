import { identitiesMock, render } from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';

import { IdentityCredentials } from './IdentityCredentials';

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('IdentityCredentials', () => {
  it('should render', () => {
    const { container } = render(<IdentityCredentials identity={identity} />);
    expect(container).toMatchSnapshot();
  });

  it('should not render credentials for new identity', () => {
    const { container } = render(<IdentityCredentials identity={NEW} />);
    expect(container).toMatchSnapshot();
  });
});
