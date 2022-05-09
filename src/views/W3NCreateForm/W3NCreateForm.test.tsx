import { identitiesMock, render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';

import { W3NCreateForm } from './W3NCreateForm';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

describe('W3NCreateForm', () => {
  it('should match the snapshot', async () => {
    const { container } = render(<W3NCreateForm identity={identity} />);
    expect(container).toMatchSnapshot();
  });
});
