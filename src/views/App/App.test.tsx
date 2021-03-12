import { render } from '@testing-library/react';
// import { Identity, init } from '@kiltprotocol/core';

import { App } from './App';

// jest.mock('@kiltprotocol/core');
// (init as jest.Mock).mockImplementation(async () => 1);
// (Identity.generateMnemonic as jest.Mock).mockImplementation(() => 'mnemonic');

describe('App', () => {
  it('should render', async () => {
    const { container } = render(<App />);
    // await findByText(/mnemonic/);
    expect(container).toMatchSnapshot();
  });
});
