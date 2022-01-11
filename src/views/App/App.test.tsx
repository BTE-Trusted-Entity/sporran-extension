import { IdentitiesProviderMock, render, screen } from '../../testing/testing';
import { initKiltSDK } from '../../utilities/initKiltSDK/initKiltSDK';

import { App } from './App';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));
jest.mock('@kiltprotocol/utils', () => ({}));

jest.mock('../../utilities/initKiltSDK/initKiltSDK');
jest.mocked(initKiltSDK).mockResolvedValue(undefined);

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
