import { ConfigService } from '@kiltprotocol/config';

import { render } from '../../testing/testing';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import {
  mockRequestCredential,
  mockUnknownCType,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { paths } from '../paths';

import { ShareCredentialSelect } from './ShareCredentialSelect';

// mock attestation querying
jest.mocked(ConfigService.get).mockImplementation((opt) => {
  if (opt === 'api')
    return {
      query: {
        attestation: {
          attestations: jest.fn().mockResolvedValue({
            // mock Option type
            isSome: false,
            isNone: true,
            unwrap: () => {
              throw new Error();
            },
          }),
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
