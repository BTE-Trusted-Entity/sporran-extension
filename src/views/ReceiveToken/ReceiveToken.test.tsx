import { render } from '../../testing';

import { ReceiveToken } from './ReceiveToken';

const account = {
  name: 'My Sporran Account',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
};

describe('ReceiveToken', () => {
  it('should render', async () => {
    const { container } = render(<ReceiveToken account={account} />);
    expect(container).toMatchSnapshot();
  });
});
