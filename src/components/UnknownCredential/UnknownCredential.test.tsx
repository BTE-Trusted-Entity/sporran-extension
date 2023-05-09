import { render } from '../../testing/testing';

import { UnknownCredential } from './UnknownCredential';

describe('UnknownCredential', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <UnknownCredential rootHash="0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae" />,
    );
    expect(container).toMatchSnapshot();
  });
});
