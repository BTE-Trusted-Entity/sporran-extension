import { render } from '../../testing';

import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('should render', () => {
    const { container } = render(<Welcome />);
    expect(container).toMatchSnapshot();
  });
});
