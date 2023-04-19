import { CType } from '@kiltprotocol/sdk-js';

import {
  moreIdentitiesMock as identities,
  render,
} from '../../testing/testing';
import { mockTerms } from '../../utilities/mockTerms/mockTerms';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { parseDidUri } from '../../utilities/did/did';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { paths } from '../paths';

import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';

import { SignQuote } from './SignQuote';

jest.mocked(CType.hashToId).mockImplementation((id) => `kilt:ctype:${id}`);

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as unknown as ReturnType<typeof parseDidUri>);

jest.mock('../../utilities/did/useIsOnChainDidDeleted');

describe('SignQuote', () => {
  it('should render', async () => {
    jest.mocked(useIsOnChainDidDeleted).mockReturnValue(false);

    const { container } = render(
      <PopupTestProvider path={paths.popup.claim} data={mockTerms}>
        <SignQuote
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should show error message if on-chain DID deleted', async () => {
    jest.mocked(useIsOnChainDidDeleted).mockReturnValue(true);

    const { container } = render(
      <PopupTestProvider path={paths.popup.claim} data={mockTerms}>
        <SignQuote
          identity={
            identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
