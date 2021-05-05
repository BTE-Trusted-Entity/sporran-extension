import { render } from '../../testing';
import { ShareCredential } from './ShareCredential';

describe('ShareCredential', () => {
  it('should render', async () => {
    const { container } = render(<ShareCredential />);
    expect(container).toMatchSnapshot();
  });
});
