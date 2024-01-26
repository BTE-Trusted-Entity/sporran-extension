import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import {
  moreIdentitiesMock as identities,
  render,
} from '../../testing/testing';

import '../../components/useCopyButton/useCopyButton.mock';

import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';
import { parseDidUri } from '../../utilities/did/did';

import { useKiltCosts } from '../../utilities/didUpgrade/didUpgrade';

import { InternalConfigurationContext } from '../../configuration/InternalConfigurationContext';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { DidUpgradeExplainer } from './DidUpgradeExplainer';

jest.mock('../../utilities/did/useIsOnChainDidDeleted');
jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4tPoYT9j4i429JktnyX9EEu9StL58YfdPCi8cUkYnvtAKRbK',
} as unknown as ReturnType<typeof parseDidUri>);

jest.mock('../../utilities/didUpgrade/didUpgrade', () => ({
  useKiltCosts: jest.fn(),
}));

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue({ did: 'EUR 1,20' });

describe('DidUpgradeExplainer', () => {
  it('should render DID not on chain yet', async () => {
    jest.mocked(useIsOnChainDidDeleted).mockReturnValue(false);
    jest.mocked(useKiltCosts).mockReturnValue({
      total: BalanceUtils.toFemtoKilt(2),
      insufficientKilt: false,
    });

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
    jest.mocked(useKiltCosts).mockReturnValue({
      total: BalanceUtils.toFemtoKilt(2),
      insufficientKilt: false,
    });

    const { container } = render(
      <DidUpgradeExplainer
        identity={
          identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render pay with euro option in internal build', async () => {
    jest.mocked(useIsOnChainDidDeleted).mockReturnValue(false);
    jest.mocked(useKiltCosts).mockReturnValue({
      total: BalanceUtils.toFemtoKilt(2),
      insufficientKilt: false,
    });

    const { container } = render(
      <InternalConfigurationContext>
        <DidUpgradeExplainer
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </InternalConfigurationContext>,
    );
    expect(container).toMatchSnapshot();
  });
});

it('should render insufficient balance to pay costs in KILT', async () => {
  jest.mocked(useIsOnChainDidDeleted).mockReturnValue(false);
  jest.mocked(useKiltCosts).mockReturnValue({
    total: BalanceUtils.toFemtoKilt(2),
    insufficientKilt: true,
  });

  const { container } = render(
    <InternalConfigurationContext>
      <DidUpgradeExplainer
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />
    </InternalConfigurationContext>,
  );
  expect(container).toMatchSnapshot();
});
