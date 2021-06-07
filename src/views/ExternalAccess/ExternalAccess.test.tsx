import { render } from '../../testing/testing';
import { ExternalAccess } from './ExternalAccess';

describe('ExternalAccess', () => {
  it('should render', async () => {
    const { container } = render(<ExternalAccess />);
    expect(container).toMatchSnapshot();
  });
});
