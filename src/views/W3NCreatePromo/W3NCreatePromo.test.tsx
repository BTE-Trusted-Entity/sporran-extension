import { FullDidDetails } from '@kiltprotocol/did';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';

import { useFullDidDetails } from '../../utilities/did/did';
import { usePromoStatus } from '../../utilities/promoBackend/promoBackend';

import { W3NCreatePromo } from './W3NCreatePromo';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

jest.mock('../../utilities/did/did');
jest.mocked(useFullDidDetails).mockReturnValue({} as FullDidDetails);

jest.mock('../../utilities/promoBackend/promoBackend');
jest.mocked(usePromoStatus).mockReturnValue({
  account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
  remaining_dids: 1000,
  is_active: true,
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
