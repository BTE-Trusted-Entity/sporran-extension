import { render } from '../../testing/testing';

import { KiltCurrency } from './KiltCurrency';

describe('KiltCurrency', () => {
  it('should render', async () => {
    const { container } = render(<KiltCurrency />);
    expect(container).toMatchSnapshot();
  });
});
