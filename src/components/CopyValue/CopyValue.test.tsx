import { render } from '../../testing/testing';

import '../../components/useCopyButton/useCopyButton.mock';

import { CopyValue } from './CopyValue';

describe('CopyValue', () => {
  it('should match the snapshot with label', async () => {
    const { container } = render(<CopyValue value="FOO" label="BAR" />);
    expect(container).toMatchSnapshot();
  });
  it('should match the snapshot with labelled-by', async () => {
    const { container } = render(<CopyValue value="FOO" labelledBy="ZAB" />);
    expect(container).toMatchSnapshot();
  });
});
