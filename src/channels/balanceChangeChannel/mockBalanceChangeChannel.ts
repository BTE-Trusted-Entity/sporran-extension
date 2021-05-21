import BN from 'bn.js';
import { balanceChangeChannel } from './balanceChangeChannel';
import { balanceMock } from './balanceChangeChannel.mock';

jest.mock('./balanceChangeChannel');

const bnBalanceMock = {
  bonded: new BN(balanceMock.bonded),
  free: new BN(balanceMock.free),
  locked: new BN(balanceMock.locked),
  total: new BN(balanceMock.total),
};

export function mockBalanceChangeChannel(): void {
  (balanceChangeChannel.subscribe as jest.Mock).mockImplementation(
    (address, publisher) => {
      publisher(bnBalanceMock);
      return () => null;
    },
  );
}
