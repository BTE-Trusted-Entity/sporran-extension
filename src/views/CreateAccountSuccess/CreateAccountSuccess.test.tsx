import { CreateAccountSuccess } from './CreateAccountSuccess';
import { render } from '../../testing';

describe('CreateAccountSuccess', () => {
  it('should render for create', async () => {
    const { container } = render(<CreateAccountSuccess />);
    expect(container).toMatchSnapshot();
  });
  it('should render for import', async () => {
    const { container } = render(<CreateAccountSuccess type="import" />);
    expect(container).toMatchSnapshot();
  });
});
