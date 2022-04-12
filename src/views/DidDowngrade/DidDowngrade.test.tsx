import { BalanceUtils } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { getFee } from '../../utilities/didDowngrade/didDowngrade';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { parseDidUri } from '../../utilities/did/did';

import {
  useDepositDid,
  useDepositWeb3Name,
} from '../../utilities/getDeposit/getDeposit';

import { DidDowngrade } from './DidDowngrade';

jest.mock('../../utilities/didDowngrade/didDowngrade');
jest.mocked(getFee).mockResolvedValue(BalanceUtils.toFemtoKilt(0.01));

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
  identifier: '4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUri>);

jest.mock('../../utilities/getDeposit/getDeposit');

const depositAmount = BalanceUtils.toFemtoKilt(1);

describe('DidDowngrade', () => {
  it('promo used for both web3name and DID', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: 'promo account',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: 'promo account',
      amount: depositAmount,
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

  it('promo used for web3name but not DID', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: 'promo account',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
      amount: depositAmount,
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
  it('promo used for DID but not web3name', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: 'promo account',
      amount: depositAmount,
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
  it('promo not used at all', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
      amount: depositAmount,
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
