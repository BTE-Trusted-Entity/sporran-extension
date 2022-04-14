import { identitiesMock, render } from '../../testing/testing';

import { mockIsFullDid } from '../../utilities/did/did.mock';

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

  it('should render full DID avatar style', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <Avatar
        identity={
          identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
