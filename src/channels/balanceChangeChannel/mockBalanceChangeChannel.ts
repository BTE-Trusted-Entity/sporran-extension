import BN from 'bn.js';
import { balanceChangeChannel } from './balanceChangeChannel';
import { balanceMock } from './balanceChangeChannel.mock';

jest.mock('./balanceChangeChannel');

const bnBalanceMock = {
  balances: {
    bonded: new BN(balanceMock.bonded),
    transferable: new BN(balanceMock.transferable),
    usableForFees: new BN(balanceMock.usableForFees),
    locked: new BN(balanceMock.locked),
    total: new BN(balanceMock.total),
  },
};

export function mockBalanceChangeChannel(): void {
  jest
    .spyOn(balanceChangeChannel, 'subscribe')
    .mockImplementation((address, publisher) => {
      publisher(null, { ...bnBalanceMock, address });
      return () => null;
    });
}
