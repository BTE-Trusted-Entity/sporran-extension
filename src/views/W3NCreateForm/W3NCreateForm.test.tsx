import { identitiesMock, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';

import { W3NCreateForm } from './W3NCreateForm';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('W3NCreateForm', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <W3NCreateForm identity={identity} onSubmit={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });
});
