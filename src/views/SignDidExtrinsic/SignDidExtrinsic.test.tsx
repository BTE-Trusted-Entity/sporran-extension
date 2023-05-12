import { GenericExtrinsic } from '@polkadot/types';

import { identitiesMock as identities, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { mockIsFullDid } from '../../utilities/did/did.mock';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import { paths } from '../paths';

import { SignDidExtrinsic } from './SignDidExtrinsic';
import {
  getExtrinsic,
  getExtrinsicValues,
  getAddServiceEndpoint,
  getRemoveServiceEndpoint,
} from './didExtrinsic';

const input: SignDidExtrinsicOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  extrinsic: '0x1c0426000c666f6f',
  submitter: '4tMMYZHsFfqzfCsgCPLJSBmomBv2d6cBEYzHKMGVKz2VjACR',
};

const specificInput: SignDidExtrinsicOriginInput = {
  ...input,
  didUri: identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'].did,
};

jest.mock('./didExtrinsic');

describe('SignDidExtrinsic', () => {
  it('should render extrinsic', async () => {
    mockIsFullDid(true);

    jest.mocked(getExtrinsic).mockResolvedValue({
      method: { section: 'web3Names', method: 'claim' },
    } as unknown as GenericExtrinsic);

    jest.mocked(getExtrinsicValues).mockReturnValue([
      {
        label: 'from',
        value:
          'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
      },
      {
        label: 'method data',
        value:
          'namespace.method(input = "some meaningful values you would definitely like to see")',
      },
    ]);

    const { container } = render(
      <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input}>
        <SignDidExtrinsic
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should render add endpoint extrinsic', async () => {
    mockIsFullDid(true);
    jest.mocked(getExtrinsic).mockResolvedValue({
      method: { section: 'did', method: 'addServiceEndpoint' },
    } as unknown as GenericExtrinsic);
    jest.mocked(getAddServiceEndpoint).mockReturnValue({
      id: '#123456',
      type: ['Some type'],
      serviceEndpoint: ['https://sporran.org'],
    });
    const { container } = render(
      <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input}>
        <SignDidExtrinsic
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should render remove endpoint extrinsic', async () => {
    mockIsFullDid(true);

    jest.mocked(getExtrinsic).mockResolvedValue({
      method: { section: 'did', method: 'removeServiceEndpoint' },
    } as unknown as GenericExtrinsic);
    jest.mocked(getRemoveServiceEndpoint).mockResolvedValue({
      id: '#123456',
      type: ['Some type'],
      serviceEndpoint: ['https://sporran.org'],
    });

    const { container } = render(
      <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input}>
        <SignDidExtrinsic
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should render remove endpoint extrinsic for specific DID', async () => {
    mockIsFullDid(true);

    jest.mocked(getExtrinsic).mockResolvedValue({
      method: { section: 'did', method: 'removeServiceEndpoint' },
    } as unknown as GenericExtrinsic);
    jest.mocked(getRemoveServiceEndpoint).mockResolvedValue({
      id: '#123456',
      type: ['Some type'],
      serviceEndpoint: ['https://sporran.org'],
    });

    const { container } = render(
      <PopupTestProvider
        path={paths.popup.signDidExtrinsic}
        data={specificInput}
      >
        <SignDidExtrinsic
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should render forbidden DID extrinsic', async () => {
    mockIsFullDid(true);
    jest.mocked(getExtrinsic).mockResolvedValue({
      method: { section: 'did', method: 'addKey' },
    } as unknown as GenericExtrinsic);

    jest.mocked(getExtrinsicValues).mockReturnValue([
      {
        label: 'from',
        value:
          'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
      },
      {
        label: 'method data',
        value:
          'namespace.method(input = "some meaningful values you would definitely like to see")',
      },
    ]);
    const { container } = render(
      <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input}>
        <SignDidExtrinsic
          identity={
            identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
          }
        />
      </PopupTestProvider>,
    );
    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
