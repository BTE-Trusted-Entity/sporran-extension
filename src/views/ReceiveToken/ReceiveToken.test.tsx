import { render } from '../../testing';

import { ReceiveToken } from './ReceiveToken';

describe('ReceiveToken', () => {
  it('should render', async () => {
    const { container } = render(<ReceiveToken />);
    expect(container).toMatchSnapshot();
  });
});
