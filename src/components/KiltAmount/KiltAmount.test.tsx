import BN from 'bn.js';

import { render } from '../../testing/testing';
import { KiltAmount } from './KiltAmount';

describe('KiltAmount', () => {
  it('should render', async () => {
    const { container } = render(<KiltAmount amount={new BN(1.234e15)} />);
    expect(container).toMatchSnapshot();
  });
});
