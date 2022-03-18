import { render } from '../../testing/testing';

import { W3NCreateSign } from './W3NCreateSign';

describe('W3NCreateSign', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<W3NCreateSign />);
    expect(container).toMatchSnapshot();
  });
});
