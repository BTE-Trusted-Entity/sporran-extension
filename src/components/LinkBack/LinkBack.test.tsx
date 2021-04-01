import { render } from '../../testing';
import { LinkBack } from './LinkBack';

describe('LinkBack', () => {
  it('should render', async () => {
    const { container } = render(<LinkBack />);
    expect(container).toMatchSnapshot();
  });
});
