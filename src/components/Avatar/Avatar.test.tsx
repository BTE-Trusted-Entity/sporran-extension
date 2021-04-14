import { render } from '../../testing';
import { Identicon } from './Identicon';

import { Avatar } from './Avatar';

jest.mock('./Identicon');
(Identicon as jest.Mock).mockImplementation(() => 'Identicon');

describe('Avatar', () => {
  it('should render', async () => {
    const { container } = render(
      <Avatar
        tartan="MacFarlane"
        address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
