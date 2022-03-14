import { Attestation } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import {
  mockRequestCredential,
  mockUnknownCType,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { parseDidUrl, sameFullDid } from '../../utilities/did/did';

import { paths } from '../paths';

import { ShareCredentialSelect } from './ShareCredentialSelect';

jest.mock('../../utilities/did/did');

jest.mocked(parseDidUrl).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUrl>);
jest.mocked(sameFullDid).mockReturnValue(true);

jest.mock('@kiltprotocol/core', () => ({ Attestation: { query: jest.fn() } }));
jest.mocked(Attestation.query).mockResolvedValue(null);

describe('ShareCredentialSelect', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider
        path={paths.popup.share.start}
        data={mockRequestCredential}
      >
        <ShareCredentialSelect onCancel={jest.fn()} onSelect={jest.fn()} />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render interface for no matching credentials', () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.share.start} data={mockUnknownCType}>
        <ShareCredentialSelect onCancel={jest.fn()} onSelect={jest.fn()} />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
