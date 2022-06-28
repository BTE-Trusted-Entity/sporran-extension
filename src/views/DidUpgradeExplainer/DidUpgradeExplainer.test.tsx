import {
  moreIdentitiesMock as identities,
  render,
} from '../../testing/testing';

import '../../components/useCopyButton/useCopyButton.mock';

import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';
import { parseDidUri } from '../../utilities/did/did';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

jest.mock('../../utilities/did/useIsOnChainDidDeleted');
jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4tPoYT9j4i429JktnyX9EEu9StL58YfdPCi8cUkYnvtAKRbK',
} as unknown as ReturnType<typeof parseDidUri>);

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
          identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
