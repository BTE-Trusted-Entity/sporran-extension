import { render } from '../../testing/testing';

import {
  useAccounts,
  useCurrentAccount,
} from '../../utilities/accounts/accounts';
import { Welcome } from './Welcome';

jest.mock('../../utilities/accounts/accounts');
(useAccounts as jest.Mock).mockImplementation(() => ({ data: {} }));
(useCurrentAccount as jest.Mock).mockImplementation(() => ({ data: {} }));

describe('Welcome', () => {
  it('should render', () => {
    const { container } = render(<Welcome />);
    expect(container).toMatchSnapshot();
  });
});
