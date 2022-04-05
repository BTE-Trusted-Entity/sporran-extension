import { BalanceUtils } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { getDeposit, getFee } from '../../utilities/didDowngrade/didDowngrade';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { parseDidUri } from '../../utilities/did/did';

import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { DidDowngrade } from './DidDowngrade';

jest.mock('../../utilities/didDowngrade/didDowngrade', () => ({
  getFee: jest.fn(),
  getDeposit: jest.fn(),
}));
jest.mocked(getFee).mockResolvedValue(BalanceUtils.toFemtoKilt(0.01));
jest.mocked(getDeposit).mockResolvedValue(BalanceUtils.toFemtoKilt(1));

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
  identifier: '4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUri>);

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');

describe('DidDowngrade', () => {
  it('should show refund amount including deposit if promo was not used', async () => {
    mockIsFullDid(true);
    jest.mocked(useSwrDataOrThrow).mockReturnValue({
      deposit: { owner: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr' },
    });

    const { container } = render(
      <DidDowngrade
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should show only fee amount if promo was used', async () => {
    mockIsFullDid(true);
    jest.mocked(useSwrDataOrThrow).mockReturnValue({
      deposit: { owner: 'some other deposit owner' },
    });

    const { container } = render(
      <DidDowngrade
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
