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
  jest
    .spyOn(balanceChangeChannel, 'subscribe')
    .mockImplementation((address, publisher) => {
      publisher(null, bnBalanceMock);
      return () => null;
    });
}
