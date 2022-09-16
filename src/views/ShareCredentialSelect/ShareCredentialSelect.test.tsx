import { ConfigService } from '@kiltprotocol/config';

import { TypeRegistry } from '@polkadot/types';

import { render } from '../../testing/testing';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import {
  mockRequestCredential,
  mockUnknownCType,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { paths } from '../paths';

import { ShareCredentialSelect } from './ShareCredentialSelect';

jest.mocked(ConfigService.get).mockImplementation((opt) => {
  if (opt === 'api')
    return {
      query: {
        attestation: {
          attestations: jest
            .fn()
            .mockResolvedValue(new TypeRegistry().createType('Option')),
        },
      },
    };
});

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
