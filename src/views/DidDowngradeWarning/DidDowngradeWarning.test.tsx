import { Attestation } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { parseDidUrl, sameFullDid } from '../../utilities/did/did';

import { DidDowngradeWarning } from './DidDowngradeWarning';

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUrl).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUrl>);
jest.mocked(sameFullDid).mockReturnValue(true);

jest.mock('@kiltprotocol/core', () => ({ Attestation: { query: jest.fn() } }));
jest.mocked(Attestation.query).mockResolvedValue(null);

describe('DidDowngradeWarning', () => {
  it('should render', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <DidDowngradeWarning
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
