import { Attestation } from '@kiltprotocol/core';

import { identitiesMock as identities, render } from '../../testing/testing';

import { parseDidUri, sameFullDid } from '../../utilities/did/did';

import { mockIsFullDid } from '../../utilities/did/did.mock';

import { SignDidCredentialsSelect } from './SignDidCredentialsSelect';

jest.mock('../../utilities/did/did');

jest.mocked(parseDidUri).mockReturnValue({
  fullDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
} as ReturnType<typeof parseDidUri>);
mockIsFullDid(true);
jest.mocked(sameFullDid).mockReturnValue(true);
jest.mocked(Attestation.query).mockResolvedValue(null);

describe('SignDidCredentialsSelect', () => {
  it('should render', async () => {
    const { container } = render(
      <SignDidCredentialsSelect
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
