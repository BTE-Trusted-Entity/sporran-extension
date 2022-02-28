import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock, render } from '../../testing/testing';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import {
  getUnsignedPresentationDownload,
  useIdentityCredentials,
} from '../../utilities/credentials/credentials';
import { paths } from '../paths';

import { CreatePresentation } from './CreatePresentation';

jest.mock('../../utilities/credentials/credentials');
jest.mocked(useIdentityCredentials).mockReturnValue(credentialsMock);
jest
  .mocked(getUnsignedPresentationDownload)
  .mockReturnValue({ name: 'name', url: 'data:' });

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('CreatePresentation', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          `/identity/${identity.address}/credentials/${credentialsMock[0].request.rootHash}/presentation`,
        ]}
      >
        <Route path={paths.identity.credentials.presentation}>
          <CreatePresentation identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
