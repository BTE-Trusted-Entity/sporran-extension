import { render } from '../../testing';
import { RemoveAccount } from './RemoveAccount';

const account = {
  name: 'My Sporran Account',
  tartan: 'MacFarlane',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  index: 1,
};

describe('RemoveAccount', () => {
  it('should render', () => {
    const { container } = render(<RemoveAccount account={account} />);
    expect(container).toMatchSnapshot();
  });
});
