import { identitiesMock, render } from '../../testing/testing';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('should render', async () => {
    const { container } = render(
      <Avatar
        identity={
          identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
