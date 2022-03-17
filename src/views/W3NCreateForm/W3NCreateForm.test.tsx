import { render } from '../../testing/testing';

import { W3NCreateForm } from './W3NCreateForm';

describe('W3NCreateForm', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<W3NCreateForm />);
    expect(container).toMatchSnapshot();
  });
});
