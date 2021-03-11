import { render } from '@testing-library/react';

import { Scroller } from './Scroller';

describe('Scroller', () => {
  it('should render', () => {
    const { container } = render(<Scroller />);
    expect(container).toMatchSnapshot();
  });
});
