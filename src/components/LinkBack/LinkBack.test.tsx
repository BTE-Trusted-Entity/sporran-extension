import { render } from '../../testing/testing';
import { LinkBack } from './LinkBack';

describe('LinkBack', () => {
  it('should render', async () => {
    const { container } = render(<LinkBack />);
    expect(container).toMatchSnapshot();
  });
});
