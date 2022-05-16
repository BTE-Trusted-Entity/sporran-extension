import { BalanceUtils } from '@kiltprotocol/core';
import { FullDidDetails } from '@kiltprotocol/did';

import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useDepositWeb3Name } from '../../utilities/getDeposit/getDeposit';
import { useFullDidDetails } from '../../utilities/did/did';

import { generatePath, paths } from '../paths';

import { W3NCreateSign } from './W3NCreateSign';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(BalanceUtils.toFemtoKilt(0.01));

jest.mock('../../utilities/getDeposit/getDeposit');
jest
  .mocked(useDepositWeb3Name)
  .mockReturnValue({ amount: BalanceUtils.toFemtoKilt(2) });

jest.mock('../../utilities/did/did');
jest.mocked(useFullDidDetails).mockReturnValue({} as FullDidDetails);

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

describe('W3NCreateSign', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.web3name.create.sign, {
            address: 'FOO',
            web3name: 'fancy-name',
          }),
        ]}
      >
        <Route path={paths.identity.web3name.create.sign}>
          <W3NCreateSign identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
