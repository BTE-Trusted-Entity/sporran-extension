import BN from 'bn.js';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { render, screen } from '../../testing';
import { Balance } from './Balance';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
(listenToBalanceChanges as jest.Mock).mockImplementation(
  async (address, callback) => {
    callback(address, new BN(1.234e15));
    return () => {
      // dummy
    };
  },
);

describe('Balance', () => {
  it('should render', async () => {
    const address = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
    const { container } = render(<Balance address={address} />);

    await screen.findByText(/K/);

    expect(container).toMatchSnapshot();
    expect(listenToBalanceChanges).toHaveBeenCalledWith(
      address,
      expect.anything(),
    );
  });
});
