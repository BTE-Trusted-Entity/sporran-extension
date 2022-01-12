import { identitiesMock as identities, render } from '../../testing/testing';

import '../../components/useCopyButton/useCopyButton.mock';

import { parseDidUrl } from '../../utilities/did/did';

import { DidManage } from './DidManage';

jest.mock('../../utilities/did/did');
jest.mocked(parseDidUrl).mockReturnValue({
  fullDid: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
} as ReturnType<typeof parseDidUrl>);

describe('DidManage', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <DidManage
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
