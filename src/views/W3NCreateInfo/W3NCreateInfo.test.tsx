import { identitiesMock, render } from '../../testing/testing';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import '../../components/useCopyButton/useCopyButton.mock';

import { W3NCreateInfo } from './W3NCreateInfo';

const on = identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];
const off = identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

describe('W3NCreateInfo', () => {
  it('should match the snapshot for off-chain did', async () => {
    mockIsFullDid(false);
    const { container } = render(<W3NCreateInfo identity={off} />);
    expect(container).toMatchSnapshot();
  });
  it('should match the snapshot for on-chain did', async () => {
    mockIsFullDid(true);
    const { container } = render(<W3NCreateInfo identity={on} />);
    expect(container).toMatchSnapshot();
  });
});
