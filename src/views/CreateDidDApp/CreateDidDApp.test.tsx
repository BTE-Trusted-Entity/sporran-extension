import { render } from '../../testing/testing';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { CreateDidOriginInput } from '../../channels/CreateDidChannels/types';

import { mockIsFullDid } from '../../utilities/did/did.mock';

import { CreateDidDApp } from './CreateDidDApp';

const mockInput: CreateDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  submitter: '4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653',
};

const mockSpecificInput: CreateDidOriginInput = {
  ...mockInput,
  pendingDidUri:
    identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'].did,
};

describe('CreateDidDApp', () => {
  it('should render with light DID', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.createDid} data={mockInput}>
        <CreateDidDApp
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();

    expect(container).toMatchSnapshot();
  });

  it('should render with a specific light DID', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.createDid} data={mockSpecificInput}>
        <CreateDidDApp
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();

    expect(container).toMatchSnapshot();
  });

  it('should render with full DID', async () => {
    mockIsFullDid(true);

    const { container } = render(
      <PopupTestProvider path={paths.popup.createDid} data={mockInput}>
        <CreateDidDApp
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();

    expect(container).toMatchSnapshot();
  });

  it('should render with removed DID', async () => {
    mockIsFullDid(false);

    const { container } = render(
      <PopupTestProvider path={paths.popup.createDid} data={mockInput}>
        <CreateDidDApp
          identity={
            identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();

    expect(container).toMatchSnapshot();
  });
});
