import { render, screen } from '../../testing';
import { App } from './App';
import {
  useAccounts,
  useCurrentAccount,
} from '../../utilities/accounts/accounts';

jest.mock('../../utilities/accounts/accounts');
(useAccounts as jest.Mock).mockImplementation(() => ({ data: {} }));
(useCurrentAccount as jest.Mock).mockImplementation(() => ({ data: {} }));

describe('App', () => {
  it('should render', async () => {
    const { container } = render(<App />);

    await screen.findByText(/Welcome/);
    expect(container).toMatchSnapshot();
  });
});
