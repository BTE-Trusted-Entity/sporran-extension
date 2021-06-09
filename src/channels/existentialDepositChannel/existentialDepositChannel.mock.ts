import BN from 'bn.js';
import { existentialDepositChannel } from './existentialDepositChannel';

jest.mock('./existentialDepositChannel');

export function mockExistentialDepositChannel(): void {
  (existentialDepositChannel.get as jest.Mock).mockResolvedValue(
    new BN('1000000000000000'),
  );
}
