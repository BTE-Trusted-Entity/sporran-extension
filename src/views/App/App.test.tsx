import { IdentitiesProviderMock, render, screen } from '../../testing/testing';
import { App } from './App';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));
jest.mock('@kiltprotocol/utils', () => ({}));

describe('App', () => {
  it('should render', async () => {
    const { container } = render(
      <IdentitiesProviderMock identities={{}}>
        <App />
      </IdentitiesProviderMock>,
    );

    await screen.findByText(/Welcome/);
    expect(container).toMatchSnapshot();
  });
});
