import { AccountsProviderMock, render, screen } from '../../testing/testing';
import { App } from './App';

describe('App', () => {
  it('should render', async () => {
    const { container } = render(
      <AccountsProviderMock accounts={{}}>
        <App />
      </AccountsProviderMock>,
    );

    await screen.findByText(/Welcome/);
    expect(container).toMatchSnapshot();
  });
});
