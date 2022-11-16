import BN from 'bn.js';
import { BalanceUtils, CType } from '@kiltprotocol/core';
import * as Did from '@kiltprotocol/did';

import { identitiesMock as identities, render } from '../../testing/testing';
import { mockTerms } from '../../utilities/mockTerms/mockTerms';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { parseDidUri } from '../../utilities/did/did';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { paths } from '../paths';

import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';

import { SignQuote } from './SignQuote';

jest.mock('@kiltprotocol/core', () => ({
  BalanceUtils: { toFemtoKilt: jest.fn() },
  CType: { hashToId: jest.fn() },
}));
jest
  .mocked(BalanceUtils.toFemtoKilt)
  .mockReturnValue(new BN('233000000000000000'));
jest.mocked(CType.hashToId).mockImplementation((id) => `kilt:ctype:${id}`);

jest.mock('@kiltprotocol/did', () => ({ isSameSubject: jest.fn() }));
jest.mocked(Did.isSameSubject).mockReturnValue(true);

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
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
