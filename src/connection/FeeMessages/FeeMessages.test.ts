import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { feeMessageListener, FeeMessageType, FeeRequest } from './FeeMessages';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
}));

describe('FeeMessages', () => {
  describe('feeMessageListener', () => {
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
      (BlockchainApiConnection.getConnectionOrConnect as jest.Mock).mockResolvedValue(
        { api: apiMock },
      );

      const fee = await feeMessageListener({
        type: FeeMessageType.feeRequest,
        data: { recipient: 'address', amount: '125000000' },
      });

      expect(fee).toEqual('partial fee');
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

    it('should ignore other messages', async () => {
      (BlockchainApiConnection.getConnectionOrConnect as jest.Mock).mockClear();

      feeMessageListener(({
        type: 'other',
        data: { address: 'address' },
      } as unknown) as FeeRequest);

      expect(
        BlockchainApiConnection.getConnectionOrConnect,
      ).not.toHaveBeenCalled();
    });
  });
});
