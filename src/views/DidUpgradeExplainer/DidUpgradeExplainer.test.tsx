import { identitiesMock as identities, render } from '../../testing/testing';

import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';
import { usePromoStatus } from '../../utilities/promoBackend/promoBackend';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

jest.mock('../../utilities/did/useIsOnChainDidDeleted');

jest.mock('../../utilities/promoBackend/promoBackend');
jest
  .mocked(usePromoStatus)
  .mockReturnValue({ is_active: false, account: '', remaining_dids: 0 });

describe('DidUpgradeExplainer', () => {
  it('should render DID not on chain yet', async () => {
    jest.mocked(useIsOnChainDidDeleted).mockReturnValue(false);

    const { container } = render(
      <DidUpgradeExplainer
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render DID already removed from chain', async () => {
    jest.mocked(useIsOnChainDidDeleted).mockReturnValue(true);

    const { container } = render(
      <DidUpgradeExplainer
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
