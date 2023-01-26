import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreateChoose } from './W3NCreateChoose';

describe('W3NCreateChoose', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <W3NCreateChoose
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
