import { Attestation } from '@kiltprotocol/core';

import { render } from '../../testing/testing';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { parseDidUrl } from '../../utilities/did/did';

import { DidDowngradeWarning } from './DidDowngradeWarning';

jest.mock('../../utilities/did/did');
(parseDidUrl as jest.Mock).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
});

jest.mock('@kiltprotocol/core', () => ({ Attestation: { query: jest.fn() } }));
(Attestation.query as jest.Mock).mockResolvedValue(false);

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
