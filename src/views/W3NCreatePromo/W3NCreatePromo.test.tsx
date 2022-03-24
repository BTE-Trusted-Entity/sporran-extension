import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';

import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { W3NCreatePromo } from './W3NCreatePromo';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');
jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
  return {
    getFullDidDetails: {},
    promoStatus: {
      account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
      remaining_dids: 1000,
      is_active: true,
    },
  }[name];
});

describe('W3NCreatePromo', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <W3NCreatePromo identity={identity} web3name="fancy-name" />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
