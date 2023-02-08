import { render } from '../../testing/testing';

import { UnknownIdentity } from './UnknownIdentity';

describe('UnknownIdentity', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <UnknownIdentity address="4qp7KB8jbwqS6XXL8zH8qZn3GCdnZDt6Nmq5M47ztGKhXJVh" />,
    );
    expect(container).toMatchSnapshot();
  });
});
