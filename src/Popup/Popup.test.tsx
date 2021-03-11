import { render } from '@testing-library/react';
import { Identity, init } from '@kiltprotocol/core';

import { Popup } from './Popup';

jest.mock('@kiltprotocol/core');
(init as jest.Mock).mockImplementation(async () => 1);
(Identity.generateMnemonic as jest.Mock).mockImplementation(() => 'mnemonic');

describe('Popup', () => {
  it('should render', async () => {
    const { container, findByText } = render(<Popup />);
    await findByText(/mnemonic/);
    expect(container).toMatchSnapshot();
  });
});
