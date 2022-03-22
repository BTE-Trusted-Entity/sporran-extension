import { act, render } from '../../testing/testing';
import { getPromoStatus } from '../../utilities/didUpgradePromo/didUpgradePromo';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

jest.mock('../../utilities/didUpgradePromo/didUpgradePromo');

const getPromoStatusPromise = Promise.resolve({
  account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
  remaining_dids: 1000,
  is_active: true,
});

jest.mocked(getPromoStatus).mockReturnValue(getPromoStatusPromise);

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
      await getPromoStatusPromise;
    });
    expect(container).toMatchSnapshot();
  });
});
