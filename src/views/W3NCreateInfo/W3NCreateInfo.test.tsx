import { identitiesMock, render } from '../../testing/testing';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import '../../components/useCopyButton/useCopyButton.mock';

import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { W3NCreateInfo } from './W3NCreateInfo';

const on = identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];
const off = identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');
jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
  return {
    promoStatus: {
      account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
      remaining_dids: 1000,
      is_active: true,
    },
  }[name];
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
