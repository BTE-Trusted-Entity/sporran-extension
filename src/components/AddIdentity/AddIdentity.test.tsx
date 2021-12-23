import { render } from '../../testing/testing';

import { AddIdentity } from './AddIdentity';

describe('AddIdentity', () => {
  it('should render', async () => {
    const { container } = render(<AddIdentity />);
    expect(container).toMatchSnapshot();
  });
});
