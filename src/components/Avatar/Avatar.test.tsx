import { render } from '../../testing/testing';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('should render', async () => {
    const { container } = render(
      <Avatar address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire" />,
    );
    expect(container).toMatchSnapshot();
  });
});
