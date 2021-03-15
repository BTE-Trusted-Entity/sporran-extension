import { CreateAccountSuccess } from './CreateAccountSuccess';
import { render } from '../../testing';

describe('CreateAccountSuccess', () => {
  it('should render', async () => {
    const { container } = render(<CreateAccountSuccess />);
    expect(container).toMatchSnapshot();
  });
});
