import { identitiesMock, render } from '../../testing/testing';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import '../../components/useCopyButton/useCopyButton.mock';

import { usePromoStatus } from '../../utilities/promoBackend/promoBackend';

import { W3NCreateInfo } from './W3NCreateInfo';

const on = identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];
const off = identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

jest.mock('../../utilities/promoBackend/promoBackend');
jest.mocked(usePromoStatus).mockReturnValue({
  account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
  remaining_dids: 1000,
  is_active: true,
});

describe('W3NCreateInfo', () => {
  it('should match the snapshot for off-chain did', async () => {
    mockIsFullDid(false);
    const { container } = render(
      <W3NCreateInfo identity={off} hasPromo={false} togglePromo={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should match the snapshot for on-chain did', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <W3NCreateInfo identity={on} hasPromo={true} togglePromo={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });
});
