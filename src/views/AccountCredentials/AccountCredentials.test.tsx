import { accountsMock, render } from '../../testing';

import { AccountCredentials } from './AccountCredentials';

const account =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('AccountCredentials', () => {
  it('should render', async () => {
    const { container } = render(<AccountCredentials account={account} />);
    expect(container).toMatchSnapshot();
  });
});
