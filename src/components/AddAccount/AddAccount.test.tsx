import { render } from '../../testing/testing';
import { AddAccount } from './AddAccount';

describe('AddAccount', () => {
  it('should render', async () => {
    const { container } = render(<AddAccount />);
    expect(container).toMatchSnapshot();
  });
});
