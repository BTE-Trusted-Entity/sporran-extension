import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import '../../components/useCopyButton/useCopyButton.mock';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { generatePath, paths } from '../paths';

import { W3NCreateSignEuro } from './W3NCreateSignEuro';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue({ w3n: 'EUR 5.00' });

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

describe('W3NCreateSignEuro', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.web3name.create.euro, {
            address: 'FOO',
            web3name: 'fancy-name',
          }),
        ]}
      >
        <Route path={paths.identity.web3name.create.euro}>
          <W3NCreateSignEuro identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
