import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { identitiesMock as identities, render } from '../../testing/testing';

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
} as unknown as ReturnType<typeof parseDidUri>);

jest.mock('../../utilities/getDeposit/getDeposit');

const depositAmount = BalanceUtils.toFemtoKilt(1);

describe('DidDowngrade', () => {
  it('promo used for both web3name and DID', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: '4promo account',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: '4promo account',
      amount: depositAmount,
    });

    const { container } = render(
      <DidDowngrade
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('promo used for web3name but not DID', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: '4promo account',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
      amount: depositAmount,
    });

    const { container } = render(
      <DidDowngrade
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
  it('promo used for DID but not web3name', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: '4promo account',
      amount: depositAmount,
    });

    const { container } = render(
      <DidDowngrade
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
  it('promo not used at all', async () => {
    mockIsFullDid(true);
    jest.mocked(useDepositDid).mockReturnValue({
      owner: '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
      amount: depositAmount,
    });
    jest.mocked(useDepositWeb3Name).mockReturnValue({
      owner: '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
      amount: depositAmount,
    });

    const { container } = render(
      <DidDowngrade
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
