import { MemoryRouter, Route } from 'react-router-dom';
import { BalanceUtils } from '@kiltprotocol/chain-helpers';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { useKiltCosts } from '../../utilities/w3nCreate/w3nCreate';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { generatePath, paths } from '../paths';
import '../../components/useCopyButton/useCopyButton.mock';

import { W3NCreateChoose } from './W3NCreateChoose';

jest.mock('../../utilities/w3nCreate/w3nCreate');
jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue({ w3n: 'EUR 5.00' });

describe('W3NCreateChoose', () => {
  it('should match the snapshot', async () => {
    jest.mocked(useKiltCosts).mockReturnValue({
      total: BalanceUtils.toFemtoKilt(1),
      deposit: BalanceUtils.toFemtoKilt(0),
      fee: BalanceUtils.toFemtoKilt(1),
      insufficientKilt: false,
    });

    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.web3name.create.choose, {
            address: '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
            web3name: 'mr_pink',
          }),
        ]}
      >
        <Route path={paths.identity.web3name.create.choose}>
          <W3NCreateChoose
            identity={
              identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
