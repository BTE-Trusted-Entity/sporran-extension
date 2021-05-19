import {
  accountsMock,
  mockBackgroundScript,
  render,
} from '../../testing/testing';
import { RemoveAccount } from './RemoveAccount';

const account =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('RemoveAccount', () => {
  it('should render', () => {
    mockBackgroundScript();
    const { container } = render(<RemoveAccount account={account} />);
    expect(container).toMatchSnapshot();
  });
});
