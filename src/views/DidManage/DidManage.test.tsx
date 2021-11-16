import { identitiesMock as identities, render } from '../../testing/testing';

import { DidManage } from './DidManage';

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
