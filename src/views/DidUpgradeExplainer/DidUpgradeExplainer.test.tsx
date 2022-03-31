import { act, render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { getPromoStatus } from '../../utilities/promoBackend/promoBackend';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

jest.mock('../../utilities/promoBackend/promoBackend');

jest.mocked(getPromoStatus).mockResolvedValue({
  account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
  remaining_dids: 1000,
  is_active: true,
});

describe('DidUpgradeExplainer', () => {
  it('should render', async () => {
    const { container } = render(
      <DidUpgradeExplainer
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    await act(async () => {
      await getPromoStatus();
    });
    expect(container).toMatchSnapshot();
  });
});
