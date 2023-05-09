import { render } from '../../testing/testing';

import { paths } from '../paths';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';

import { AttestationRejected } from './AttestationRejected';

describe('AttestationRejected', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.reject}
        data={credentialsMock[13].credential.rootHash}
      >
        <AttestationRejected />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
