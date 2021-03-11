import { render } from '@testing-library/react';

import { Hello } from './Hello';

describe('Hello', () => {
  it('should render', () => {
    const { container } = render(<Hello />);
    expect(container).toMatchSnapshot();
  });
});
