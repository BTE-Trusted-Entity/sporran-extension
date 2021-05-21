import BN from 'bn.js';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { getFee } from './feeChannel';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
}));

describe('feeChannel', () => {
  describe('getFee', () => {
    it('should respond with fee to the proper messages', async () => {
      const txMock = {
        toHex() {
          return 'hex transaction';
        },
      };
      const infoMock = {
        partialFee: {
          toString() {
            return 'partial fee';
          },
        },
      };
      const apiMock = {
        tx: { balances: { transfer: jest.fn(() => txMock) } },
        rpc: { payment: { queryInfo: jest.fn().mockResolvedValue(infoMock) } },
      };
      (
        BlockchainApiConnection.getConnectionOrConnect as jest.Mock
      ).mockResolvedValue({ api: apiMock });

      const fee = await getFee({
        recipient: 'address',
        amount: new BN(125000000),
      });

      expect(fee.toString()).toEqual('partial fee');
      expect(BlockchainApiConnection.getConnectionOrConnect).toHaveBeenCalled();

      expect(apiMock.tx.balances.transfer).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
      expect(
        (apiMock.tx.balances.transfer as jest.Mock).mock.calls[0][1].toString(
          10,
        ),
      ).toEqual('125000000');

      expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
        'hex transaction',
      );
    });
  });
});
