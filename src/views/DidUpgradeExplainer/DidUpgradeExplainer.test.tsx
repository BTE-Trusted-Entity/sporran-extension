import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { useDidDeletionStatus } from '../../utilities/did/useDidDeletionStatus';
import { usePromoStatus } from '../../utilities/promoBackend/promoBackend';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

jest.mock('../../utilities/did/useDidDeletionStatus');

jest.mock('../../utilities/promoBackend/promoBackend');
jest
  .mocked(usePromoStatus)
  .mockReturnValue({ is_active: false, account: '', remaining_dids: 0 });

describe('DidUpgradeExplainer', () => {
  it('should render DID not on chain yet', async () => {
    jest.mocked(useDidDeletionStatus).mockReturnValue(false);

    const { container } = render(
      <DidUpgradeExplainer
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render DID already removed from chain', async () => {
    jest.mocked(useDidDeletionStatus).mockReturnValue(true);

    const { container } = render(
      <DidUpgradeExplainer
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
