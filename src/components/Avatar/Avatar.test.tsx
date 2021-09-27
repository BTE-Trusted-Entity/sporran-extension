import { identitiesMock, render } from '../../testing/testing';

import { Avatar } from './Avatar';

import { mockIsFullDid } from '../../utilities/did/did.mock';

describe('Avatar', () => {
  it('should render', async () => {
    const { container } = render(
      <Avatar
        identity={
          identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render full DID avatar style', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <Avatar
        identity={
          identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
