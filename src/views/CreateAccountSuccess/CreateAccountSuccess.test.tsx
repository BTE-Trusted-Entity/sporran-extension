import { CreateAccountSuccess } from './CreateAccountSuccess';
import { render } from '../../testing';

const address = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

describe('CreateAccountSuccess', () => {
  it('should render for create', async () => {
    const { container } = render(<CreateAccountSuccess address={address} />);
    expect(container).toMatchSnapshot();
  });
  it('should render for import', async () => {
    const { container } = render(
      <CreateAccountSuccess type="import" address={address} />,
    );
    expect(container).toMatchSnapshot();
  });
});
