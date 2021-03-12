import { render } from '@testing-library/react';
import { Warning } from './Warning';

describe('Warning', () => {
  it('should render', () => {
    const { container } = render(<Warning />);
    expect(container).toMatchSnapshot();
  });
});
