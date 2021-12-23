import { identitiesMock, render, screen } from '../../testing/testing';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import {
  credentialsMock,
  mockRequestCredential,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { paths } from '../paths';

import { Selected } from '../ShareCredential/ShareCredential';

import { ShareCredentialSign } from './ShareCredentialSign';

const mockSelected: Selected = {
  credential: credentialsMock[0],
  identity: identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'],
  sharedProps: ['Email'],
};

describe('ShareCredentialSign', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.sign}
        data={mockRequestCredential}
      >
        <ShareCredentialSign onCancel={jest.fn()} selected={mockSelected} />
      </PopupTestProvider>,
    );
    expect(screen.queryByText('Mock Name')).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
