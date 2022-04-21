import { FullDidDetails } from '@kiltprotocol/did';

import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';

import { useFullDidDetails } from '../../utilities/did/did';
import { usePromoStatus } from '../../utilities/promoBackend/promoBackend';

import { generatePath, paths } from '../paths';

import { W3NCreatePromo } from './W3NCreatePromo';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

jest.mock('../../utilities/did/did');
jest.mocked(useFullDidDetails).mockReturnValue({} as FullDidDetails);

jest.mock('../../utilities/promoBackend/promoBackend');
jest.mocked(usePromoStatus).mockReturnValue({
  account: '4oY2qsDpYBf2LqahCTmEC4iudf667CRT3iNoBmMLfznZoGcM',
  remaining_dids: 1000,
  is_active: true,
});

describe('W3NCreatePromo', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.web3name.create.promo.sign, {
            address: 'FOO',
            web3name: 'fancy-name',
          }),
        ]}
      >
        <Route path={paths.identity.did.web3name.create.promo.sign}>
          <W3NCreatePromo identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
