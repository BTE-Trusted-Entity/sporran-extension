import { render } from '../../testing/testing';
import { AppSettings } from './AppSettings';

describe('AppSettings', () => {
  it('should render', async () => {
    const { container } = render(<AppSettings />);
    expect(container).toMatchSnapshot();
  });
});
