import { init } from '@kiltprotocol/core';

import { render, screen } from '../../testing';
import { App } from './App';

jest.mock('@kiltprotocol/core');
(init as jest.Mock).mockImplementation(async () => 1);

describe('App', () => {
  it('should render', async () => {
    const { container } = render(<App />);

    await screen.findByText(/Welcome/);
    expect(container).toMatchSnapshot();
  });
});
