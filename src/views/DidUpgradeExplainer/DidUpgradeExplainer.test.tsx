import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');

describe('DidUpgradeExplainer', () => {
  it('should render DID not on chain yet', async () => {
    jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
      return {
        getPromoStatus: { is_active: false },
        getDidDeletionStatus: false,
      }[name];
    });
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
    jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
      return {
        getPromoStatus: { is_active: false },
        getDidDeletionStatus: true,
      }[name];
    });
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
