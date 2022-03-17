import { render } from '../../testing/testing';

import { W3NCreateInfo } from './W3NCreateInfo';

describe('W3NCreateInfo', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<W3NCreateInfo />);
    expect(container).toMatchSnapshot();
  });
});
